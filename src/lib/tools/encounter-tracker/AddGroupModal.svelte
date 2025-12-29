<script lang="ts">
	import { onMount } from "svelte";

	interface Props {
		onAdd: (name: string) => void;
		onClose: () => void;
	}

	let { onAdd, onClose }: Props = $props();
	let name = $state("");
	let dialog = $state<HTMLDialogElement>();

	onMount(() => {
		dialog?.showModal();
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (name.trim()) {
			onAdd(name.trim());
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
		<h3 class="font-serif text-2xl font-bold">New Group</h3>
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
				<button type="submit" class="btn btn-primary">Create Group</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
