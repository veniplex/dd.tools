<script lang="ts">
	import EncounterCard from "./EncounterCard.svelte";
	import { encounterStore, type Group } from "./db.svelte";
	import type { Encounter } from "./types";
	import EditGroupModal from "./EditGroupModal.svelte";
	import ConfirmationModal from "./ConfirmationModal.svelte";
	import IconEdit from "~icons/heroicons/pencil-square";
	import IconTrash from "~icons/heroicons/trash";

	let { encounters = $bindable() }: { encounters: Encounter[] } = $props();

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

	let dragOverGroup = $state<string | null>(null);
	let isDragging = $state(false);

	function handleGlobalDragStart(e: DragEvent) {
		// Use a micro-delay to allow the browser to initialize the drag ghost
		// before we shift the layout by showing the "Not Assigned" group.
		setTimeout(() => {
			isDragging = true;
		}, 0);
	}

	function handleGlobalDragEnd(e: DragEvent) {
		isDragging = false;
	}

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

	function handleDragOver(e: DragEvent, groupId: string | null) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "move";
		}
		dragOverGroup = groupId === null ? "unassigned" : groupId;
	}

	function handleDragLeave() {
		dragOverGroup = null;
	}

	async function handleDrop(e: DragEvent, groupName?: string) {
		e.preventDefault();
		dragOverGroup = null;

		const encounterId = e.dataTransfer?.getData("text/plain");
		if (!encounterId) return;

		const encounter = encounterStore.encounters.find((enc) => enc.id === encounterId);
		if (encounter) {
			await encounterStore.updateEncounter({
				...encounter,
				group: groupName
			});
		}
	}
</script>

<div
	class="flex flex-col gap-8"
	role="list"
	ondragstart={handleGlobalDragStart}
	ondragend={handleGlobalDragEnd}
>
	<!-- Ungrouped Encounters (Conditional at the top) -->
	{#if ungrouped.length > 0 || isDragging}
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-4 px-2">
				<h3 class="text-xs font-semibold tracking-wider text-base-content/50 uppercase">
					Not Assigned
				</h3>
			</div>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="grid grid-cols-1 gap-4 rounded-xl border-2 p-2 md:grid-cols-2 lg:grid-cols-3 {dragOverGroup ===
				'unassigned'
					? 'border-primary bg-primary/5'
					: 'border-base-content/10'}"
				ondragover={(e) => handleDragOver(e, null)}
				ondragleave={handleDragLeave}
				ondrop={(e) => handleDrop(e)}
			>
				{#each ungrouped as encounter (encounter.id)}
					<EncounterCard {encounter} />
				{/each}

				{#if ungrouped.length === 0}
					<div
						class="col-span-full flex h-[86px] items-center justify-center rounded-xl border-2 border-dashed border-base-content/10 text-sm text-base-content/30"
					>
						No unassigned encounters
					</div>
				{/if}
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

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="grid grid-cols-1 gap-4 rounded-xl border-2 p-2 md:grid-cols-2 lg:grid-cols-3 {dragOverGroup ===
				group.id
					? 'border-primary bg-primary/5'
					: 'border-base-content/10'}"
				ondragover={(e) => handleDragOver(e, group.id)}
				ondragleave={handleDragLeave}
				ondrop={(e) => handleDrop(e, group.name)}
			>
				{#each encounters as encounter (encounter.id)}
					<EncounterCard {encounter} />
				{/each}

				{#if encounters.length === 0}
					<div
						class="col-span-full flex h-[86px] items-center justify-center rounded-xl border-2 border-dashed border-base-content/10 text-sm text-base-content/30"
					>
						No assigned encounters
					</div>
				{/if}
			</div>
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
