import type { Component } from 'svelte';

export type ToolStatus = 'released' | 'beta' | 'planned';

export interface ToolMetadata {
	title: string;
	description: string;
	icon: Component;
	status: ToolStatus;
	slug: string;
	version?: string;
}
