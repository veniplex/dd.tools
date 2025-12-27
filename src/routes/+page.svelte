<script lang="ts">
	import ToolCard from '$lib/components/ToolCard.svelte';
	import { tools } from '$lib/tools/config';
	import type { ToolStatus } from '$lib/tools/types';

	const statusPriority: Record<ToolStatus, number> = {
		released: 0,
		beta: 1,
		planned: 2
	};

	const sortedTools = $derived(
		[...tools].sort((a, b) => {
			const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
			if (priorityDiff !== 0) return priorityDiff;
			return a.title.localeCompare(b.title);
		})
	);
</script>

<div class="flex flex-col gap-16 pb-12">
	<!-- Hero Section -->
	<section class="hero bg-base-100 rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
		<div class="hero-content text-center py-16 px-8 max-w-3xl">
			<div>
				<h1 class="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight text-primary">
					Adventurers, <span class="text-base-content">Welcome Home.</span>
				</h1>
				<p class="text-xl md:text-2xl opacity-80 mb-10 leading-relaxed italic">
					Enhance your D&D experience with powerful, localized tools designed for DMs and players alike. 
					100% Offline. 100% Powerful.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<button class="btn btn-primary btn-lg shadow-lg">Start Quest</button>
					<button class="btn btn-outline btn-lg">Learn More</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Tools Grid -->
	<section>
		<div class="flex items-center justify-between mb-8 px-2">
			<h2 class="text-3xl font-serif font-bold tracking-wide">Available Tools</h2>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each sortedTools as tool (tool.slug)}
				<ToolCard {...tool} />
			{/each}
			
			<!-- Bonus Card for Custom Tools -->
			<div class="card bg-base-200/50 border-2 border-dashed border-base-content/20 flex items-center justify-center p-8 text-center opacity-70 group hover:opacity-100 transition-opacity">
				<div class="card-body py-12">
					<p class="text-lg font-bold font-serif">Have a Tool Idea?</p>
					<p class="text-xs opacity-70">Join the development and shape the future of D&D Tools.</p>
					<div class="card-actions justify-center mt-4">
						<button class="btn btn-sm btn-ghost border-base-content/20 uppercase tracking-widest text-[10px]">Contribute</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
