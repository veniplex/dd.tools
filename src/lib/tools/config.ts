import type { ToolMetadata } from './types';

// Icons from unplugin-icons
import IconSword from '~icons/mdi/sword-cross';
import IconAdventure from '~icons/hugeicons/adventure';

export const tools: ToolMetadata[] = [
	{
		title: 'Encounter Tracker',
		description: 'Plan and track your encounters with ease. Manage your party and enemies in one place.',
		icon: IconSword,
		status: 'beta',
		slug: 'encounter-tracker'
	},
	{
		title: 'Adventure Manager',
		description: 'Plan and track your adventures with ease. Create and manage your campaigns and one-shots.',
		icon: IconAdventure,
		status: 'planned',
		slug: 'adventure-manager'
	}
];
