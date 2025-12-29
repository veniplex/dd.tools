<script lang="ts">
	import EncounterCard from "./EncounterCard.svelte";
	import { encounterStore, type Group } from "./db.svelte";
	import EditGroupModal from "./EditGroupModal.svelte";
	import ConfirmationModal from "./ConfirmationModal.svelte";
	import IconEdit from "~icons/heroicons/pencil-square";
	import IconTrash from "~icons/heroicons/trash";

	// Data is now primarily sourced from encounterStore directly for global state
	// but we still accept encounters as a prop if needed for filtering
	let ungrouped = $derived(encounterStore.encounters.filter((e) => !e.group));

	let groupData = $derived(
		encounterStore.groups.map((group) => ({
			group,
			encounters: encounterStore.encounters.filter((e) => e.group === group.name)
		}))
	);

	let groupToEdit = $state<Group | null>(null);
	let groupToDelete = $state<Group | null>(null);

	async function handleEditGroup(name: string) {
		if (groupToEdit) {
			await encounterStore.updateGroup({ ...groupToEdit, name });
			groupToEdit = null;
		}
	}

	async function handleDeleteGroup() {
		if (groupToDelete) {
			await encounterStore.deleteGroup(groupToDelete.id);
			groupToDelete = null;
		}
	}
</script>

<div class="flex flex-col gap-8">
	<!-- Ungrouped Encounters -->
	{#if ungrouped.length > 0}
		<div class="flex flex-col gap-3">
			<h3 class="px-2 text-xs font-semibold tracking-wider text-base-content/50 uppercase">
				Not Assigned
			</h3>
			<div
				class="grid grid-cols-1 gap-4 rounded-xl border-2 border-base-content/10 p-2 md:grid-cols-2 lg:grid-cols-3"
			>
				{#each ungrouped as encounter (encounter.id)}
					<EncounterCard {encounter} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Grouped Encounters -->
	{#each groupData as { group, encounters } (group.id)}
		<div class="flex flex-col gap-1">
			<div class="group flex items-center gap-4 px-2">
				<h3 class="text-xs font-semibold tracking-wider text-base-content/50 uppercase">
					{group.name}
				</h3>
				<div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					<button
						class="btn btn-square btn-ghost btn-sm"
						onclick={() => (groupToEdit = group)}
						title="Edit Group"
					>
						<IconEdit class="h-4 w-4" />
					</button>
					<button
						class="btn btn-square text-error btn-ghost btn-sm"
						onclick={() => (groupToDelete = group)}
						title="Delete Group"
					>
						<IconTrash class="h-4 w-4" />
					</button>
				</div>
			</div>

			{#if encounters.length > 0}
				<div
					class="grid grid-cols-1 gap-4 rounded-xl border-2 border-base-content/10 p-2 md:grid-cols-2 lg:grid-cols-3"
				>
					{#each encounters as encounter (encounter.id)}
						<EncounterCard {encounter} />
					{/each}
				</div>
			{:else}
				<div
					class="flex h-[86px] items-center justify-center rounded-xl border-2 border-dashed border-base-content/10 text-sm text-base-content/30"
				>
					No assigned encounters
				</div>
			{/if}
		</div>
	{/each}
</div>

{#if groupToEdit}
	<EditGroupModal
		group={groupToEdit}
		onConfirm={handleEditGroup}
		onClose={() => (groupToEdit = null)}
	/>
{/if}

{#if groupToDelete}
	<ConfirmationModal
		title="Delete Group"
		message="Are you sure you want to delete the group '{groupToDelete.name}'? Encounters in this group will not be deleted, but will become unassigned."
		confirmLabel="Delete"
		onConfirm={handleDeleteGroup}
		onCancel={() => (groupToDelete = null)}
	/>
{/if}
