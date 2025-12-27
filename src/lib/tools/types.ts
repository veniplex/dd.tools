import type { Component } from 'svelte';

export type ToolStatus = 'released' | 'beta' | 'planned';

export interface ToolMetadata {
	title: string;
	description: string;
	icon: Component;
	href: string;
	status: ToolStatus;
	slug: string;
	order: number;
	version?: string;
}
