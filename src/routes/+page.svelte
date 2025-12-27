<script lang="ts">
	import ToolCard from "$lib/components/ToolCard.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { tools } from "$lib/tools/config";
	import type { ToolStatus } from "$lib/tools/types";

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
	<Hero />

	<!-- Tools Grid -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each sortedTools as tool (tool.slug)}
			<ToolCard {...tool} />
		{/each}

		<!-- Bonus Card for Custom Tools -->
		<div
			class="group card flex items-center justify-center border-2 border-dashed border-base-content/20 bg-base-200/50 p-8 text-center opacity-70 transition-opacity hover:opacity-100"
		>
			<div class="card-body py-12">
				<p class="font-serif text-lg font-bold">Have a Tool Idea?</p>
				<p class="text-xs opacity-70">Join the development and shape the future of D&D Tools.</p>
				<div class="mt-4 card-actions justify-center">
					<button
						class="btn border-base-content/20 text-[10px] tracking-widest uppercase btn-ghost btn-sm"
						>Contribute</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
