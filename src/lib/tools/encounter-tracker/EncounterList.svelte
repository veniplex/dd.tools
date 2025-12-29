<script lang="ts">
	import EncounterCard from "./EncounterCard.svelte";
	import type { Encounter } from "./types";

	interface Props {
		encounters: Encounter[];
	}

	let { encounters = [] }: Props = $props();

	let ungrouped = $derived(encounters.filter((e) => !e.group));
	let groups = $derived(
		encounters.reduce(
			(acc, e) => {
				if (e.group) {
					acc[e.group] = acc[e.group] || [];
					acc[e.group].push(e);
				}
				return acc;
			},
			{} as Record<string, Encounter[]>
		)
	);
</script>

<div class="flex flex-col gap-8">
	<!-- Ungrouped Encounters -->
	{#if ungrouped.length > 0}
		<div class="flex flex-col gap-4">
			<!-- <h3 class="px-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
				Unassigned Encounters
			</h3> -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each ungrouped as encounter (encounter.id)}
					<EncounterCard {encounter} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Grouped Encounters -->
	{#each Object.entries(groups) as [groupName, groupEncounters] (groupName)}
		<div class="flex flex-col gap-4">
			<h3 class="px-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
				{groupName}
			</h3>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each groupEncounters as encounter (encounter.id)}
					<EncounterCard {encounter} />
				{/each}
			</div>
		</div>
	{/each}
</div>
