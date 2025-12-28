<script lang="ts">
	import type { Encounter } from "./types";

	let { encounter }: { encounter: Encounter } = $props();
</script>

<a
	href="/encounter-tracker/{encounter.id}"
	class="card transform overflow-hidden border border-primary/25 bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105 hover:border-primary"
>
	<div class="card-body items-start text-start">
		<div class="flex w-full justify-between">
			<h2 class="card-title font-serif text-2xl tracking-wide">{encounter.name}</h2>
			<div class="badge badge-ghost font-medium">
				{encounter.status}
			</div>
		</div>
		{#if encounter.description}
			<p class="text-sm text-primary">{encounter.description}</p>
		{/if}
	</div>
</a>
