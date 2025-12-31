<script lang="ts">
	import type { UnitAffiliation, Unit } from "./types";
	import IconDice from "~icons/game-icons/dice-twenty-faces-twenty";
	import { onMount } from "svelte";
	import { evaluateMath } from "./db.svelte";

	interface Props {
		mode: "add" | "edit";
		unit?: Unit;
		onConfirm: (unitData: Omit<Unit, "id">) => void;
		onClose: () => void;
	}

	let { mode, unit, onConfirm, onClose }: Props = $props();
	// svelte-ignore state_referenced_locally
	let name = $state(unit?.name ?? "");
	// svelte-ignore state_referenced_locally
	let hp = $state(unit?.hp ?? 10);
	// svelte-ignore state_referenced_locally
	let maxHp = $state(unit?.maxHp ?? 10);
	// svelte-ignore state_referenced_locally
	let ac = $state(unit?.ac ?? 10);
	// svelte-ignore state_referenced_locally
	let initiativeBonus = $state(unit?.initiativeBonus ?? 0);
	// svelte-ignore state_referenced_locally
	let initiative = $state(unit?.initiative ?? 0);
	// svelte-ignore state_referenced_locally
	let affiliation = $state<UnitAffiliation>(unit?.affiliation ?? "enemy");
	// svelte-ignore state_referenced_locally
	let tempHp = $state(unit?.tempHp ?? 0);
	// svelte-ignore state_referenced_locally
	let dialog = $state<HTMLDialogElement | undefined>(undefined);

	onMount(() => {
		dialog?.showModal();
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onConfirm({
			name,
			hp: evaluateMath(hp),
			maxHp: mode === "add" ? evaluateMath(hp) : evaluateMath(maxHp),
			ac: evaluateMath(ac),
			initiativeBonus: evaluateMath(initiativeBonus),
			initiative: evaluateMath(initiative),
			affiliation,
			tempHp: evaluateMath(tempHp)
		});
		onClose();
	}

	function rollInitiative() {
		initiative = Math.floor(Math.random() * 20) + 1 + initiativeBonus;
	}

	function handleClose() {
		onClose();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="modal"
	onclose={handleClose}
	onclick={(e) => e.target === dialog && handleClose()}
>
	<div class="modal-box max-w-md border border-base-300 shadow-2xl">
		<h3 class="font-serif text-2xl font-bold">{mode === "add" ? "Add New Unit" : "Edit Unit"}</h3>

		<form onsubmit={handleSubmit} class="mt-4 flex flex-col gap-4">
			<div class="form-control">
				<label class="label" for="unit-name">
					<span class="label-text">Name</span>
				</label>
				<input
					id="unit-name"
					type="text"
					bind:value={name}
					placeholder="Goblin, Aragorn, etc."
					class="input-bordered input"
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="form-control">
					<label class="label" for="unit-hp">
						<span class="label-text">{mode === "add" ? "HP" : "Current HP"}</span>
					</label>
					<input
						id="unit-hp"
						type="text"
						bind:value={hp}
						class="input-bordered input"
						min="0"
						required
					/>
				</div>
				{#if mode === "edit"}
					<div class="form-control">
						<label class="label" for="unit-max-hp">
							<span class="label-text">Max HP</span>
						</label>
						<input
							id="unit-max-hp"
							type="text"
							bind:value={maxHp}
							class="input-bordered input"
							min="1"
							required
						/>
					</div>
				{/if}
				<div class="form-control">
					<label class="label" for="unit-ac">
						<span class="label-text">AC</span>
					</label>
					<input id="unit-ac" type="number" bind:value={ac} class="input-bordered input" required />
				</div>
				{#if mode === "edit"}
					<div class="form-control">
						<label class="label" for="unit-temp-hp">
							<span class="label-text">Temp HP</span>
						</label>
						<input
							id="unit-temp-hp"
							type="text"
							bind:value={tempHp}
							class="input-bordered input"
							min="0"
						/>
					</div>
				{:else}
					<div></div>
				{/if}
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="form-control">
					<label class="label" for="unit-init-bonus">
						<span class="label-text">Initiative Bonus</span>
					</label>
					<input
						id="unit-init-bonus"
						type="text"
						bind:value={initiativeBonus}
						class="input-bordered input"
					/>
				</div>
				<div class="form-control">
					<label class="label" for="unit-init">
						<span class="label-text">Initiative Roll</span>
					</label>
					<div class="join w-full">
						<input
							id="unit-init"
							type="text"
							bind:value={initiative}
							class="input-bordered input join-item w-full"
						/>
						<button
							type="button"
							class="btn join-item btn-square"
							onclick={rollInitiative}
							title="Roll d20"
						>
							<IconDice />
						</button>
					</div>
				</div>
			</div>

			<div class="form-control">
				<label class="label" for="unit-affiliation">
					<span class="label-text">Affiliation</span>
				</label>
				<select id="unit-affiliation" class="select-bordered select" bind:value={affiliation}>
					<option value="player">Player</option>
					<option value="ally">Ally</option>
					<option value="neutral">Neutral</option>
					<option value="enemy">Enemy</option>
				</select>
			</div>

			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={handleClose}>Cancel</button>
				<button type="submit" class="btn btn-primary">
					{mode === "add" ? "Add Unit" : "Save Changes"}
				</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
