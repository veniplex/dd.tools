<script lang="ts">
	import { encounterStore } from "./db.svelte";
	import { onMount } from "svelte";

	interface Props {
		onAdd: (name: string, group?: string) => void;
		onClose: () => void;
	}

	let { onAdd, onClose }: Props = $props();
	let name = $state("");
	let groupId = $state("");
	let dialog = $state<HTMLDialogElement>();

	onMount(() => {
		dialog?.showModal();
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (name.trim()) {
			const group = encounterStore.groups.find((g) => g.id === groupId);
			onAdd(name.trim(), group?.name);
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
	onclick={(e) => e.target === dialog && handleClose()}
>
	<div class="modal-box max-w-sm">
		<h3 class="font-serif text-2xl font-bold">New Encounter</h3>
		<form onsubmit={handleSubmit} class="mt-4 flex flex-col gap-4">
			<div class="form-control">
				<label class="label" for="enc-name">
					<span class="label-text">Encounter Name</span>
				</label>
				<input
					id="enc-name"
					type="text"
					bind:value={name}
					placeholder="Goblin Ambush, etc."
					class="input-bordered input"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label" for="enc-group">
					<span class="label-text">Assign to Group</span>
				</label>
				<select id="enc-group" class="select-bordered select" bind:value={groupId}>
					<option value="">None</option>
					{#each encounterStore.groups as group (group.id)}
						<option value={group.id}>{group.name}</option>
					{/each}
				</select>
			</div>

			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={handleClose}>Cancel</button>
				<button type="submit" class="btn btn-primary">Create Encounter</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
