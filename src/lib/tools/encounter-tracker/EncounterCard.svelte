<script lang="ts">
	import type { Encounter } from "./types";
	import { encounterStore } from "./db.svelte";
	import EditEncounterModal from "./EditEncounterModal.svelte";
	import IconEdit from "~icons/heroicons/pencil";
	import IconDuplicate from "~icons/heroicons/document-duplicate";
	import IconTrash from "~icons/heroicons/trash";
	import ConfirmationModal from "./ConfirmationModal.svelte";

	let { encounter }: { encounter: Encounter } = $props();
	let showEditModal = $state(false);
	let showDuplicateModal = $state(false);
	let showDeleteModal = $state(false);

	const statusColors: Record<string, string> = {
		active: "badge-success",
		paused: "badge-warning",
		stopped: "badge-error"
	};

	async function handleEditConfirm(name: string, group?: string) {
		await encounterStore.updateEncounter({ ...encounter, name, group });
	}

	async function handleDuplicateConfirm(name: string, group?: string) {
		await encounterStore.duplicateEncounter(encounter.id, name, group);
	}

	async function handleDelete() {
		await encounterStore.deleteEncounter(encounter.id);
		showDeleteModal = false;
	}
</script>

<div class="group relative">
	<a
		href="/encounter-tracker/{encounter.id}"
		class="card flex flex-col border border-base-300 bg-base-200 p-4 transition-all hover:border-primary hover:bg-base-300 hover:shadow-md"
	>
		<div class="flex justify-between">
			<div class="flex flex-col">
				<h3 class="font-serif text-xl font-bold group-hover:text-primary">
					{encounter.name}
				</h3>
				{#if encounter.description}
					<p class="text-sm text-base-content/60">{encounter.description}</p>
				{/if}
			</div>

			<div class="flex gap-1 bg-base-300 opacity-0 transition-opacity group-hover:opacity-100">
				<button
					class="btn btn-square btn-ghost btn-sm"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						showEditModal = true;
					}}
					title="Edit"
				>
					<IconEdit class="h-4 w-4" />
				</button>
				<button
					class="btn btn-square btn-ghost btn-sm"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						showDuplicateModal = true;
					}}
					title="Duplicate"
				>
					<IconDuplicate class="h-4 w-4" />
				</button>
				<button
					class="btn btn-square text-error btn-ghost btn-sm"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						showDeleteModal = true;
					}}
					title="Delete"
				>
					<IconTrash class="h-4 w-4" />
				</button>
			</div>
		</div>
	</a>

	{#if showEditModal}
		<EditEncounterModal
			mode="edit"
			initialName={encounter.name}
			initialGroup={encounter.group}
			onConfirm={handleEditConfirm}
			onClose={() => (showEditModal = false)}
		/>
	{/if}

	{#if showDuplicateModal}
		<EditEncounterModal
			mode="duplicate"
			initialName={encounter.name}
			initialGroup={encounter.group}
			onConfirm={handleDuplicateConfirm}
			onClose={() => (showDuplicateModal = false)}
		/>
	{/if}

	{#if showDeleteModal}
		<ConfirmationModal
			title="Delete Encounter"
			message="Are you sure you want to delete encounter '{encounter.name}'? This action cannot be undone."
			confirmLabel="Delete"
			onConfirm={handleDelete}
			onCancel={() => (showDeleteModal = false)}
		/>
	{/if}
</div>
