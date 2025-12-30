<script lang="ts">
	import { page } from "$app/state";
	import { encounterStore } from "$lib/tools/encounter-tracker/db.svelte";
	import type { Encounter, Unit } from "$lib/tools/encounter-tracker/types";
	import UnitRow from "$lib/tools/encounter-tracker/UnitRow.svelte";
	import AddUnitModal from "$lib/tools/encounter-tracker/AddUnitModal.svelte";
	import EditEncounterModal from "$lib/tools/encounter-tracker/EditEncounterModal.svelte";
	import ConfirmationModal from "$lib/tools/encounter-tracker/ConfirmationModal.svelte";
	import IconPlus from "~icons/heroicons/plus";
	import IconArrowLeft from "~icons/heroicons/arrow-left";
	import IconEdit from "~icons/heroicons/pencil";
	import IconDuplicate from "~icons/heroicons/document-duplicate";
	import IconTrash from "~icons/heroicons/trash";
	import { goto } from "$app/navigation";

	let id = $derived(page.params.id);
	let encounter = $derived(encounterStore.encounters.find((e) => e.id === id));

	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let showDuplicateModal = $state(false);
	let showDeleteEncounterModal = $state(false);
	let unitToDelete = $state<string | null>(null);

	let sortedUnits = $derived(
		encounter?.units?.slice().sort((a, b) => b.initiative - a.initiative) || []
	);

	async function handleAddUnit(unitData: Omit<Unit, "id">) {
		if (encounter) {
			await encounterStore.addUnit(encounter.id, unitData);
		}
	}

	async function handleUpdateUnit(updatedUnit: Unit) {
		if (encounter) {
			const units = encounter.units.map((u) => (u.id === updatedUnit.id ? updatedUnit : u));
			await encounterStore.updateEncounter({ ...encounter, units });
		}
	}

	async function handleDeleteUnit() {
		if (encounter && unitToDelete) {
			const units = encounter.units.filter((u) => u.id !== unitToDelete);
			await encounterStore.updateEncounter({ ...encounter, units });
			unitToDelete = null;
		}
	}

	async function handleEditConfirm(name: string, description?: string, group?: string) {
		if (encounter) {
			await encounterStore.updateEncounter({ ...encounter, name, description, group });
		}
	}

	async function handleDuplicateConfirm(name: string, description?: string, group?: string) {
		if (encounter) {
			const dup = await encounterStore.duplicateEncounter(encounter.id, name, group);
			if (dup) {
				// Update description if it changed (duplicateEncounter doesn't accept desc as param yet but we can update it after)
				if (description !== encounter.description) {
					await encounterStore.updateEncounter({ ...dup, description });
				}
				goto(`/encounter-tracker/${dup.id}`);
			}
		}
	}

	async function handleDeleteEncounter() {
		if (encounter) {
			await encounterStore.deleteEncounter(encounter.id);
			goto("/encounter-tracker");
		}
	}
</script>

<div class="container mx-auto p-4">
	{#if encounter}
		<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<a href="/encounter-tracker" class="btn btn-ghost">
					<IconArrowLeft class="size-6" />
				</a>
				<div>
					<h1 class="font-serif text-3xl font-bold">{encounter.name}</h1>
					<p class="text-base-content/60">
						{encounter.group ? `${encounter.group} •` : ""}
						{encounter.units.length} Units
					</p>
				</div>
			</div>
			<div class="flex flex-wrap gap-2">
				<button onclick={() => (showEditModal = true)} class="btn btn-ghost">
					<IconEdit class="size-5" />
				</button>
				<button onclick={() => (showDuplicateModal = true)} class="btn btn-ghost">
					<IconDuplicate class="size-5" />
				</button>
				<button onclick={() => (showDeleteEncounterModal = true)} class="btn text-error btn-ghost">
					<IconTrash class="size-5" />
				</button>
				<button class="btn btn-primary" onclick={() => (showAddModal = true)}>
					<IconPlus class="mr-2 size-5" /> Add Unit
				</button>
			</div>
		</div>

		<!-- TODO: round management -->

		<div class="flex flex-col gap-3">
			{#if sortedUnits.length === 0}
				<div class="card items-center bg-base-200 p-12 text-center text-base-content/50">
					<p>No units in this encounter yet.</p>
					<button class="btn mt-4 w-fit btn-primary" onclick={() => (showAddModal = true)}>
						<IconPlus class="mr-2 size-5" /> Add Unit
					</button>
				</div>
			{:else}
				{#each sortedUnits as unit (unit.id)}
					<UnitRow {unit} onUpdate={handleUpdateUnit} onDelete={() => (unitToDelete = unit.id)} />
				{/each}
			{/if}

			{#if showAddModal}
				<AddUnitModal onAdd={handleAddUnit} onClose={() => (showAddModal = false)} />
			{/if}

			{#if showEditModal}
				<EditEncounterModal
					mode="edit"
					initialName={encounter.name}
					initialDescription={encounter.description}
					initialGroup={encounter.group}
					onConfirm={handleEditConfirm}
					onClose={() => (showEditModal = false)}
				/>
			{/if}

			{#if showDuplicateModal}
				<EditEncounterModal
					mode="duplicate"
					initialName={encounter.name}
					initialDescription={encounter.description}
					initialGroup={encounter.group}
					onConfirm={handleDuplicateConfirm}
					onClose={() => (showDuplicateModal = false)}
				/>
			{/if}

			{#if showDeleteEncounterModal}
				<ConfirmationModal
					title="Delete Encounter"
					message="Are you sure you want to delete encounter '{encounter.name}'? This action cannot be undone."
					confirmLabel="Delete"
					onConfirm={handleDeleteEncounter}
					onCancel={() => (showDeleteEncounterModal = false)}
				/>
			{/if}

			{#if unitToDelete}
				<ConfirmationModal
					title="Delete Unit"
					message="Are you sure you want to delete this unit? This action cannot be undone."
					confirmLabel="Delete"
					onConfirm={handleDeleteUnit}
					onCancel={() => (unitToDelete = null)}
				/>
			{/if}
		</div>
	{:else}
		<div class="flex h-64 flex-col items-center justify-center gap-4">
			<span class="loading loading-lg loading-spinner"></span>
			<p>Loading encounter...</p>
		</div>
	{/if}
</div>
