<script lang="ts">
	import ToolCard from "$lib/components/ToolCard.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { tools } from "$lib/tools/config";
	import type { ToolStatus } from "$lib/tools/types";
	import IconFeedback from "~icons/mdi/feedback";
	import IconGithub from "~icons/mdi/github";

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
		<div class="card transform overflow-hidden border-2 border-dashed border-base-content/50">
			<div class="card-body items-center text-center">
				<div class="mb-2 text-5xl text-primary opacity-75 transition-transform duration-300">
					<IconFeedback />
				</div>
				<h2 class="card-title font-serif text-2xl tracking-wide opacity-75">Have a Tool Idea?</h2>
				<p class="text-sm text-primary opacity-75">
					Join the development and shape the future of D&D Tools.
				</p>
				<div class="card-actions justify-center opacity-90">
					<a href="https://github.com/veniplex/dd.tools" target="_blank"
						><button class="btn"><IconGithub />Contribute on GitHub</button></a
					>
				</div>
			</div>
		</div>
	</div>
</div>
