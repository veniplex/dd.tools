export type EncounterStatus = 'active' | 'stopped' | 'paused';

export interface Encounter {
	id: string;
	name: string;
	description?: string;
	status: EncounterStatus;
	group?: string;
}
