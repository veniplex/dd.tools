import Dexie, { type Table, liveQuery } from 'dexie';
import { browser } from '$app/environment';
import type { Encounter, Unit } from './types';

export interface Group {
	id: string;
	name: string;
}

export class EncounterDatabase extends Dexie {
	encounters!: Table<Encounter>;
	groups!: Table<Group>;

	constructor() {
		super('EncounterDatabase');
		this.version(2).stores({
			encounters: 'id, name, status, group',
			groups: 'id, name'
		});
	}
}

export const db = new EncounterDatabase();

// Reactive Store using Svelte 5 Runes
class EncounterStore {
	#encounters = $state<Encounter[]>([]);
	#groups = $state<Group[]>([]);
	#loading = $state(true);
	#error = $state<string | null>(null);

	constructor() {
		if (browser) {
			this.init();
		} else {
			this.#loading = false;
		}
	}

	get encounters() {
		return this.#encounters;
	}

	get groups() {
		return this.#groups;
	}

	get loading() {
		return this.#loading;
	}

	get error() {
		return this.#error;
	}

	private init() {
		this.#loading = true;

		// Use liveQuery for automatic reactivity with Dexie
		const encounterObservable = liveQuery(() => db.encounters.toArray());
		const groupObservable = liveQuery(() => db.groups.toArray());

		encounterObservable.subscribe({
			next: (all) => {
				this.#encounters = all;
				if (this.#groups.length > 0 || !browser) this.#loading = false;
				this.#error = null;
			},
			error: (err) => {
				console.error('Failed to load encounters:', err);
				this.#error = 'Failed to load data from local storage.';
				this.#loading = false;
			}
		});

		groupObservable.subscribe({
			next: (all) => {
				this.#groups = all;
				if (this.#encounters.length > 0 || !browser) this.#loading = false;
				this.#error = null;
			},
			error: (err) => {
				console.error('Failed to load groups:', err);
				this.#error = 'Failed to load groups from local storage.';
				this.#loading = false;
			}
		});
	}

	async addEncounter(name: string, group?: string) {
		if (!browser) return;
		
		const newEncounter: Encounter = {
			id: crypto.randomUUID().split("-")[0],
			name,
			status: 'paused',
			group,
			units: [],
			round: 1
		};
		
		try {
			await db.encounters.add($state.snapshot(newEncounter));
			return newEncounter;
		} catch (err) {
			console.error('Failed to add encounter:', err);
			throw err;
		}
	}

	async updateEncounter(encounter: Encounter) {
		if (!browser) return;
		
		try {
			await db.encounters.put($state.snapshot(encounter));
		} catch (err) {
			console.error('Failed to update encounter:', err);
			throw err;
		}
	}

	async deleteEncounter(id: string) {
		if (!browser) return;
		
		try {
			await db.encounters.delete(id);
		} catch (err) {
			console.error('Failed to delete encounter:', err);
			throw err;
		}
	}

	async getEncounter(id: string) {
		if (!browser) return null;
		return await db.encounters.get(id);
	}

	async duplicateEncounter(id: string, newName?: string, newGroup?: string) {
		if (!browser) return;
		const original = await this.getEncounter(id);
		if (!original) return;

		const duplicate: Encounter = {
			...original,
			id: crypto.randomUUID().split("-")[0],
			name: newName || `${original.name} (Copy)`,
			group: newGroup === undefined ? original.group : newGroup,
			status: 'paused',
			round: 1,
			units: original.units.map((u) => ({ ...u, id: crypto.randomUUID().split("-")[0] }))
		};

		try {
			await db.encounters.add($state.snapshot(duplicate));
			return duplicate;
		} catch (err) {
			console.error('Failed to duplicate encounter:', err);
			throw err;
		}
	}

	async addUnit(encounterId: string, unit: Omit<Unit, 'id'>) {
		if (!browser) return;
		
		const encounter = await this.getEncounter(encounterId);
		if (!encounter) return;

		const newUnit: Unit = {
			...unit,
			id: crypto.randomUUID().split("-")[0]
		};

		encounter.units.push(newUnit);
		await this.updateEncounter(encounter);
		return newUnit;
	}

	// Group Methods
	async addGroup(name: string) {
		if (!browser) return;
		const newGroup: Group = {
			id: crypto.randomUUID().split("-")[0],
			name
		};
		try {
			await db.groups.add(newGroup);
			return newGroup;
		} catch (err) {
			console.error('Failed to add group:', err);
			throw err;
		}
	}

	async deleteGroup(id: string) {
		if (!browser) return;
		try {
			await db.groups.delete(id);
			// Optional: Update encounters that were in this group?
			// For now, they will just appear as "Not assigned"
		} catch (err) {
			console.error('Failed to delete group:', err);
			throw err;
		}
	}
}

export const encounterStore = new EncounterStore();
