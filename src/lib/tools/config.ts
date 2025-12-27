import type { ToolMetadata } from './types';

// Icons from unplugin-icons
import IconCastle from '~icons/mdi/castle';
import IconSword from '~icons/mdi/sword-cross';
import IconDice from '~icons/mdi/dice-d20';
import IconBook from '~icons/mdi/book-open-variant';
import IconScroll from '~icons/mdi/scroll-text';

export const tools: ToolMetadata[] = [
	{
		title: 'Campaign Manager',
		description: 'The ultimate tool for DMs. Organize your worlds, NPCs, and quest lines in one central place.',
		icon: IconCastle,
		href: '/tools/campaign-manager',
		status: 'released',
		slug: 'campaign-manager',
		order: 1,
		version: '1.0.0'
	},
	{
		title: 'Combat Tracker',
		description: 'Streamline your battles. Track initiative, HP, and conditions without breaking the flow.',
		icon: IconSword,
		href: '/tools/combat-tracker',
		status: 'beta',
		slug: 'combat-tracker',
		order: 2
	},
	{
		title: 'Dice Roller',
		description: 'Digital polyhedrals for when you forget your bag at home. Quick, fair, and immersive.',
		icon: IconDice,
		href: '/tools/dice-roller',
		status: 'planned',
		slug: 'dice-roller',
		order: 3
	},
	{
		title: 'Spellbook',
		description: 'Quick reference for thousands of spells. Filter by class, level, and school of magic.',
		icon: IconBook,
		href: '/tools/spellbook',
		status: 'planned',
		slug: 'spellbook',
		order: 4
	},
	{
		title: 'Character Vault',
		description: 'Store and manage your party\'s character sheets. Stay updated on their latest feats.',
		icon: IconScroll,
		href: '/tools/character-vault',
		status: 'planned',
		slug: 'character-vault',
		order: 5
	}
];
