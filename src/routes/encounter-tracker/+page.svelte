<script lang="ts">
	import EncounterList from "$lib/tools/encounter-tracker/EncounterList.svelte";
	import { encounterStore } from "$lib/tools/encounter-tracker/db.svelte";
	import AddEncounterModal from "$lib/tools/encounter-tracker/AddEncounterModal.svelte";
	import AddGroupModal from "$lib/tools/encounter-tracker/AddGroupModal.svelte";
	import IconPlus from "~icons/heroicons/plus";
	import IconFolderPlus from "~icons/heroicons/folder-plus";

	let showEncounterModal = $state(false);
	let showGroupModal = $state(false);

	async function handleAddEncounter(name: string, description?: string, group?: string) {
		await encounterStore.addEncounter(name, description, group);
	}

	async function handleAddGroup(name: string) {
		await encounterStore.addGroup(name);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-8 text-center font-serif text-4xl font-bold md:text-5xl">Encounter Tracker</h1>

	<div class="mb-12 flex flex-wrap justify-center gap-4">
		<button class="btn btn-primary" onclick={() => (showEncounterModal = true)}>
			<IconPlus class="size-5" /> New Encounter
		</button>
		<button class="btn btn-outline btn-primary" onclick={() => (showGroupModal = true)}>
			<IconFolderPlus class="size-5" /> New Group
		</button>
	</div>

	{#if encounterStore.loading}
		<div class="flex h-64 items-center justify-center">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:else}
		<EncounterList encounters={encounterStore.encounters} />
	{/if}
</div>

{#if showEncounterModal}
	<AddEncounterModal onAdd={handleAddEncounter} onClose={() => (showEncounterModal = false)} />
{/if}

{#if showGroupModal}
	<AddGroupModal onAdd={handleAddGroup} onClose={() => (showGroupModal = false)} />
{/if}
