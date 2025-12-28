<script lang="ts">
	import EncounterList from "$lib/tools/encounter-tracker/EncounterList.svelte";
	import type { Encounter } from "$lib/tools/encounter-tracker/types";

	const encounters: Encounter[] = [
		{
			id: "1",
			name: "Encounter 1",
			description: "Description 1",
			status: "active",
			group: "Group 1"
		},
		{
			id: "2",
			name: "This is a very long name for an encounter",
			description: "Description 2",
			status: "active",
			group: "Group 2"
		},
		{
			id: "3",
			name: "Encounter 3",
			status: "paused"
		},
		{
			id: "4",
			name: "Encounter 4",
			description: "Description 4",
			group: "Group 3",
			status: "paused"
		},
		{
			id: "5",
			name: "Encounter 5",
			group: "Group 1",
			status: "stopped"
		},
		{
			id: "6",
			name: "Encounter 6",
			status: "stopped"
		}
	];
</script>

<h1 class="text-center font-serif text-2xl font-bold md:text-4xl">Encounter Tracker</h1>

<button class="btn btn-primary">New Encounter</button>

<EncounterList {encounters} />
