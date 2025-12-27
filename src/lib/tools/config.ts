import type { ToolMetadata } from './types';

// Icons from unplugin-icons
import IconCastle from '~icons/mdi/castle';
import IconSword from '~icons/mdi/sword-cross';
import IconDice from '~icons/mdi/dice-d20';
import IconMonster from '~icons/game-icons/spiked-dragon-head';
import IconBook from '~icons/mdi/book-open-variant';
import IconScroll from '~icons/mdi/scroll-text';

export const tools: ToolMetadata[] = [
	{
		title: 'Combat Tracker',
		description: 'Streamline your battles. Track initiative, HP, and conditions without breaking the flow.',
		icon: IconSword,
		status: 'beta',
		slug: 'combat-tracker'
	},
	{
		title: 'Monster Library',
		description: 'Quick reference for thousands of monsters. Filter by type, size, and alignment.',
		icon: IconMonster,
		status: 'beta',
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
