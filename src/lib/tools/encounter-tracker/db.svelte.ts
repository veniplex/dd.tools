import Dexie, { type Table, liveQuery } from 'dexie';
import { browser } from '$app/environment';
import type { Encounter, Unit } from './types';

export function evaluateMath(input: string | number): number {
	if (typeof input === 'number') return input;
	// Remove all characters except digits, operators (+, -, *, /), and dots
	const sanitized = input.replace(/[^0-9+\-*/.]/g, '');
	try {
		// Use a safe way to evaluate. Since we sanitized, we can use Function or a custom parser.
		// For simplicity and safety (since we only allowed math chars), we'll use a simple parser
		// but for now, Function is "safe enough" after the strict regex cleanup.
		// However, let's do a slightly cleaner regex evaluation for basic operations if possible.
		return Number(new Function(`return ${sanitized || '0'}`)());
	} catch {
		return parseInt(sanitized) || 0;
	}
}

export function validateUnit(unit: Unit): Unit {
	const validated = { ...unit };
	validated.maxHp = Math.max(1, evaluateMath(validated.maxHp));
	validated.hp = Math.max(0, Math.min(evaluateMath(validated.hp), validated.maxHp));
	validated.tempHp = Math.max(0, evaluateMath(validated.tempHp));
	validated.ac = evaluateMath(validated.ac);
	validated.initiative = evaluateMath(validated.initiative);
	validated.initiativeBonus = evaluateMath(validated.initiativeBonus);
	return validated;
}

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
	#encountersLoaded = false;
	#groupsLoaded = false;

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
				this.#encountersLoaded = true;
				this.checkLoading();
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
				this.#groupsLoaded = true;
				this.checkLoading();
				this.#error = null;
			},
			error: (err) => {
				console.error('Failed to load groups:', err);
				this.#error = 'Failed to load groups from local storage.';
				this.#loading = false;
			}
		});
	}

	private checkLoading() {
		if (this.#encountersLoaded && this.#groupsLoaded) {
			this.#loading = false;
		}
	}

	async addEncounter(name: string, description?: string, group?: string) {
		if (!browser) return;
		
		const newEncounter: Encounter = {
			id: crypto.randomUUID().split("-")[0],
			name,
			description,
			status: 'paused',
			group,
			units: [],
			round: 0,
			timerSeconds: 0
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
			timerSeconds: 0,
			units: original.units.map((u) => ({ ...u, id: crypto.randomUUID().split("-")[0], tempHp: u.tempHp ?? 0 }))
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

		const newUnit: Unit = validateUnit({
			...unit,
			id: crypto.randomUUID().split("-")[0]
		});

		encounter.units.push(newUnit);
		await this.updateEncounter(encounter);
		return newUnit;
	}

	async updateUnit(encounterId: string, updatedUnit: Unit) {
		if (!browser) return;
		
		const encounter = await this.getEncounter(encounterId);
		if (!encounter) return;

		const validatedUnit = validateUnit(updatedUnit);
		const units = encounter.units.map(u => u.id === validatedUnit.id ? validatedUnit : u);
		
		await this.updateEncounter({ ...encounter, units });
	}

	// Group Methods
	async addGroup(name: string) {
		if (!browser) return;
		const newGroup: Group = {
			id: crypto.randomUUID().split('-')[0],
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

	async updateGroup(group: Group) {
		if (!browser) return;

		const oldGroup = await db.groups.get(group.id);
		if (!oldGroup) return;

		try {
			await db.transaction('rw', [db.groups, db.encounters], async () => {
				await db.groups.put($state.snapshot(group));

				if (oldGroup.name !== group.name) {
					// Update all encounters that used the old name
					const affectedEncounters = await db.encounters.where('group').equals(oldGroup.name).toArray();
					for (const enc of affectedEncounters) {
						enc.group = group.name;
						await db.encounters.put(enc);
					}
				}
			});
		} catch (err) {
			console.error('Failed to update group:', err);
			throw err;
		}
	}

	async deleteGroup(id: string) {
		if (!browser) return;
		
		const group = await db.groups.get(id);
		if (!group) return;

		try {
			await db.transaction('rw', [db.groups, db.encounters], async () => {
				await db.groups.delete(id);
				
				// Set group to undefined for all encounters in this group
				const affectedEncounters = await db.encounters.where('group').equals(group.name).toArray();
				for (const enc of affectedEncounters) {
					delete enc.group;
					await db.encounters.put(enc);
				}
			});
		} catch (err) {
			console.error('Failed to delete group:', err);
			throw err;
		}
	}
}

export const encounterStore = new EncounterStore();
