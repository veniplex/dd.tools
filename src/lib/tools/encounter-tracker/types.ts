export type EncounterStatus = 'active' | 'stopped' | 'paused';
export type UnitAffiliation = 'player' | 'ally' | 'neutral' | 'enemy';

export interface Unit {
	id: string;
	name: string;
	hp: number;
	maxHp: number;
	tempHp: number;
	ac: number;
	initiativeBonus: number;
	initiative: number;
	affiliation: UnitAffiliation;
}

export interface Encounter {
	id: string;
	name: string;
	description?: string;
	status: EncounterStatus;
	group?: string;
	units: Unit[];
	round: number;
	currentTurn?: string; // unit id
	timerSeconds?: number;
}
