<script lang="ts">
	import { encounterStore } from "./db.svelte";
	import { onMount, tick } from "svelte";

	interface Props {
		encounterId?: string;
		initialName: string;
		initialDescription?: string;
		initialGroup?: string;
		mode: "edit" | "duplicate";
		onConfirm: (name: string, description?: string, group?: string) => void;
		onClose: () => void;
	}

	let {
		encounterId,
		initialName,
		initialDescription,
		initialGroup,
		mode,
		onConfirm,
		onClose
	}: Props = $props();

	// We capture the initial values once to avoid the Svelte 5 reactivity warning
	// when using props directly in $state()
	const initialNameValue = mode === "duplicate" ? `${initialName} (Copy)` : initialName;
	const initialDescValue = initialDescription || "";
	const initialGroupValue = initialGroup || "";

	let name = $state(initialNameValue);
	let description = $state(initialDescValue);
	let groupName = $state(initialGroupValue);
	let dialog = $state<HTMLDialogElement>();
	let isBackdropMouseDown = false;

	onMount(() => {
		dialog?.showModal();
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (name.trim()) {
			onConfirm(name.trim(), description.trim() || undefined, groupName || undefined);
			onClose();
		}
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
	onmousedown={(e) => (isBackdropMouseDown = e.target === dialog)}
	onclick={(e) => isBackdropMouseDown && e.target === dialog && handleClose()}
>
	<div class="modal-box max-w-sm">
		<h3 class="font-serif text-2xl font-bold">
			{mode === "edit" ? "Edit Encounter" : "Duplicate Encounter"}
		</h3>
		<form onsubmit={handleSubmit} class="mt-4 flex flex-col gap-4">
			<div class="form-control">
				<label class="label" for="edit-name">
					<span class="label-text">Encounter Name</span>
				</label>
				<input id="edit-name" type="text" bind:value={name} class="input-bordered input" required />
			</div>

			<div class="form-control">
				<label class="label" for="edit-group">
					<span class="label-text">Group</span>
				</label>
				<select id="edit-group" class="select-bordered select" bind:value={groupName}>
					<option value="">None</option>
					{#each encounterStore.groups as group (group.id)}
						<option value={group.name}>{group.name}</option>
					{/each}
				</select>
			</div>

			<div class="form-control">
				<label class="label" for="edit-desc">
					<span class="label-text">Description</span>
				</label>
				<textarea
					id="edit-desc"
					bind:value={description}
					placeholder="Short summary of the scene..."
					class="textarea-bordered textarea h-24"
				></textarea>
			</div>

			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={handleClose}>Cancel</button>
				<button type="submit" class="btn btn-primary">
					{mode === "edit" ? "Save Changes" : "Duplicate"}
				</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
