<script lang="ts">
	import { onMount, untrack } from "svelte";
	import type { Group } from "./db.svelte";

	interface Props {
		group: Group;
		onConfirm: (name: string) => void;
		onClose: () => void;
	}

	let { group, onConfirm, onClose }: Props = $props();
	let name = $state(untrack(() => group.name));
	let dialog = $state<HTMLDialogElement>();
	let isBackdropMouseDown = false;

	onMount(() => {
		dialog?.showModal();
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (name.trim()) {
			onConfirm(name.trim());
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
		<h3 class="font-serif text-2xl font-bold">Edit Group</h3>
		<form onsubmit={handleSubmit} class="mt-4 flex flex-col gap-4">
			<div class="form-control">
				<label class="label" for="group-name">
					<span class="label-text">Group Name</span>
				</label>
				<input
					id="group-name"
					type="text"
					bind:value={name}
					placeholder="Campaign Name, etc."
					class="input-bordered input"
					required
				/>
			</div>
			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={handleClose}>Cancel</button>
				<button type="submit" class="btn btn-primary">Save Changes</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
