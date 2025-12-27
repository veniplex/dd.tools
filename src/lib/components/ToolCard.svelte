<script lang="ts">
	import type { ToolMetadata } from '$lib/tools/types';

	let { 
		title, 
		description, 
		icon: Icon, 
		href, 
		status,
		version 
	}: Partial<ToolMetadata> & Pick<ToolMetadata, 'title' | 'description' | 'icon' | 'href' | 'status' | 'version'> = $props();

	const statusConfig = $derived({
		released: { style: 'badge badge-ghost', text: version ? `v${version}` : '' },
		beta: { style: 'badge badge-info badge-soft', text: 'BETA' },
		planned: { style: 'badge badge-accent badge-dash', text: 'PLANNED' }
	});
</script>

<svelte:element
	this={status === 'planned' ? 'div' : 'a'}
	{href}
	class="card group border-primary/10 {status !== 'planned' ? 'hover:border-primary/40 hover:bg-base-200' : 'cursor-default opacity-80'} bg-base-100 shadow-xl transition-all duration-300"
>
	<div class="card-body items-center text-center">
		<div
			class="mb-2 text-5xl text-primary transition-transform duration-300"
		>
			<Icon />
		</div>
		<h2 class="card-title font-serif text-2xl tracking-wide">{title}</h2>
		<p class="text-sm opacity-70">{description}</p>
		<div class="card-actions mt-4 justify-center h-6 w-full">
			<div
				class="{statusConfig[status].style}"
			>
				{statusConfig[status].text}
			</div>
		</div>
	</div>
</svelte:element>

<style>
	/* Custom hover effect for card elevation - only for links */
	a.card:hover {
		transform: translateY(-4px);
	}
</style>
