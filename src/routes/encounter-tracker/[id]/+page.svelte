<script lang="ts">
	import { page } from "$app/state";
	import { encounterStore } from "$lib/tools/encounter-tracker/db.svelte";
	import type { Encounter, Unit } from "$lib/tools/encounter-tracker/types";
	import UnitRow from "$lib/tools/encounter-tracker/UnitRow.svelte";
	import UnitModal from "$lib/tools/encounter-tracker/UnitModal.svelte";
	import EditEncounterModal from "$lib/tools/encounter-tracker/EditEncounterModal.svelte";
	import ConfirmationModal from "$lib/tools/encounter-tracker/ConfirmationModal.svelte";
	import IconPlus from "~icons/heroicons/plus";
	import IconArrowLeft from "~icons/heroicons/arrow-left";
	import IconEdit from "~icons/heroicons/pencil";
	import IconDuplicate from "~icons/heroicons/document-duplicate";
	import IconTrash from "~icons/heroicons/trash";
	import IconMore from "~icons/lucide/more-vertical";
	import RoundManager from "$lib/tools/encounter-tracker/RoundManager.svelte";
	import { goto } from "$app/navigation";

	let id = $derived(page.params.id);
	let encounter = $derived(encounterStore.encounters.find((e) => e.id === id));

	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let showDuplicateModal = $state(false);
	let showDeleteEncounterModal = $state(false);
	let unitToDelete = $state<string | null>(null);
	let unitToEdit = $state<Unit | null>(null);

	let sortedUnits = $derived(
		[...(encounter?.units || [])].sort((a, b) => {
			const totalA = a.initiative + a.initiativeBonus;
			const totalB = b.initiative + b.initiativeBonus;
			if (totalB !== totalA) return totalB - totalA;
			if (b.initiativeBonus !== a.initiativeBonus) return b.initiativeBonus - a.initiativeBonus;
			return a.name.localeCompare(b.name);
		})
	);

	async function handleAddUnit(unitData: Omit<Unit, "id">) {
		if (encounter) {
			await encounterStore.addUnit(encounter.id, unitData);
		}
	}

	async function handleUpdateUnit(updatedUnit: Unit) {
		if (encounter) {
			await encounterStore.updateUnit(encounter.id, updatedUnit);
		}
	}

	async function handleDeleteUnit() {
		if (encounter && unitToDelete) {
			const units = encounter.units.filter((u) => u.id !== unitToDelete);
			await encounterStore.updateEncounter({ ...encounter, units });
			unitToDelete = null;
		}
	}

	function handleEditUnit(unit: Unit) {
		unitToEdit = unit;
	}

	async function handleEditUnitConfirm(unitData: Omit<Unit, "id">) {
		if (encounter && unitToEdit) {
			const updatedUnit: Unit = { ...unitData, id: unitToEdit.id };
			await encounterStore.updateUnit(encounter.id, updatedUnit);
			unitToEdit = null;
		}
	}

	async function handleDuplicateUnit(unit: Unit) {
		if (encounter) {
			const { id: _, ...unitData } = unit;

			// Extract base name and current number
			// Matches "Name #123" -> ["Name #123", "Name", "123"]
			// Matches "Name" -> ["Name", "Name", undefined]
			const nameMatch = unit.name.match(/^(.*?)(?:\s+#(\d+))?$/);
			const baseName = nameMatch ? nameMatch[1].trim() : unit.name.trim();

			// Find all existing numbers for this base name
			const existingNumbers = new Set<number>();
			encounter.units.forEach((u) => {
				const m = u.name.match(/^(.*?)(?:\s+#(\d+))?$/);
				if (m) {
					const uBase = m[1].trim();
					if (uBase === baseName) {
						const uNum = m[2] ? parseInt(m[2]) : 1;
						existingNumbers.add(uNum);
					}
				}
			});

			// Find the smallest available number n > 1
			// Note: If "Goblin" (no suffix) exists, it's considered #1.
			// The user wants the first duplicate to be #2.
			let nextNum = 2;
			while (existingNumbers.has(nextNum)) {
				nextNum++;
			}

			const newName = `${baseName} #${nextNum}`;
			await encounterStore.addUnit(encounter.id, { ...unitData, name: newName });
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
		<!-- Encounter Header -->
		<div class="mb-6 flex items-center justify-between gap-4">
			<div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
				<a href="/encounter-tracker" class="btn shrink-0 px-2 btn-ghost" title="Back to Encounters">
					<IconArrowLeft class="size-6" />
				</a>

				<div class="flex min-w-0 items-center gap-1 sm:gap-2">
					<div class="min-w-0">
						<h1 class="truncate font-serif text-2xl font-bold sm:text-3xl">
							{encounter.name}
						</h1>
						<p class="truncate text-xs text-base-content/60 sm:text-sm">
							{encounter.group ? `${encounter.group} • ` : ""}{encounter.units.length} Units
						</p>
					</div>

					<div class="dropdown dropdown-start dropdown-bottom shrink-0">
						<button tabindex="0" class="btn btn-ghost btn-sm" aria-label="Encounter Actions">
							<IconMore class="size-4" />
						</button>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<ul
							tabindex="0"
							class="dropdown-content menu w-48 rounded-box border border-base-300 bg-base-200 p-2 shadow-xl"
						>
							<li>
								<button onclick={() => (showEditModal = true)}>
									<IconEdit class="size-4" /> Edit Encounter
								</button>
							</li>
							<li>
								<button onclick={() => (showDuplicateModal = true)}>
									<IconDuplicate class="size-4" /> Duplicate
								</button>
							</li>
							<div class="divider my-0"></div>
							<li>
								<button onclick={() => (showDeleteEncounterModal = true)} class="text-error">
									<IconTrash class="size-4" /> Delete
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="shrink-0">
				<button class="btn btn-primary" onclick={() => (showAddModal = true)}>
					<IconPlus class="size-5" />
					<span class="hidden sm:inline">Add Unit</span>
				</button>
			</div>
		</div>

		{#if encounter.units.length > 0}
			<RoundManager {encounter} />
		{/if}

		<!-- Unit List -->
		<div class="flex flex-col gap-2">
			{#if sortedUnits.length === 0}
				<div class="card items-center bg-base-200 p-12 text-center text-base-content/50">
					<p>No units in this encounter yet.</p>
					<button class="btn mt-4 w-fit btn-primary" onclick={() => (showAddModal = true)}>
						<IconPlus class="mr-2 size-5" /> Add Unit
					</button>
				</div>
			{:else}
				<!-- Table Header -->
				<div
					class="grid grid-cols-[1fr_2fr_1fr_4fr_1fr_1fr] gap-4 px-4 text-xs font-bold tracking-wider uppercase md:grid-cols-[1fr_4fr_1fr_6fr_1fr_1fr] lg:grid-cols-[1fr_4fr_1fr_8fr_1fr_1fr]"
				>
					<div class="text-center">Ini</div>
					<div class="text-start">Unit</div>
					<div class="text-center">AC</div>
					<div class="text-center">HP</div>
					<div class="text-center">Tmp</div>
					<div class="text-center"></div>
				</div>

				{#each sortedUnits as unit (unit.id)}
					<UnitRow
						{unit}
						isActive={encounter.currentTurn === unit.id}
						onUpdate={handleUpdateUnit}
						onDelete={() => (unitToDelete = unit.id)}
						onEdit={handleEditUnit}
						onDuplicate={handleDuplicateUnit}
					/>
				{/each}
			{/if}

			{#if showAddModal}
				<UnitModal mode="add" onConfirm={handleAddUnit} onClose={() => (showAddModal = false)} />
			{/if}

			{#if unitToEdit}
				<UnitModal
					mode="edit"
					unit={unitToEdit}
					onConfirm={handleEditUnitConfirm}
					onClose={() => (unitToEdit = null)}
				/>
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
