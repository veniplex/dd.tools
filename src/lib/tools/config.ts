import type { ToolMetadata } from './types';

// Icons from unplugin-icons
import IconSword from '~icons/mdi/sword-cross';
import IconDice from '~icons/mdi/dice-d20';
import IconMonster from '~icons/game-icons/spiked-dragon-head';
import IconScroll from '~icons/mdi/scroll-text';

export const tools: ToolMetadata[] = [
	{
		title: 'Encounter Tracker',
		description: 'Plan and track your encounters with ease. Manage your party and enemies in one place.',
		icon: IconSword,
		status: 'beta',
		slug: 'encounter-tracker'
	},
	{
		title: 'Monster Library',
		description: 'Quick reference for thousands of monsters. Filter by type, size, and alignment.',
		icon: IconMonster,
		status: 'planned',
		slug: 'monster-library'
	},
	{
		title: 'Dice Roller',
		description: 'Digital polyhedrals for when you forget your bag at home. Quick, fair, and immersive.',
		icon: IconDice,
		status: 'planned',
		slug: 'dice-roller'
	},
	{
		title: 'Character Vault',
		description: 'Store and manage your party\'s character sheets. Stay updated on their latest feats.',
		icon: IconScroll,
		status: 'planned',
		slug: 'character-vault'
	}
];
