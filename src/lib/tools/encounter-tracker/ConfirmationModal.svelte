<script lang="ts">
	import { onMount } from "svelte";

	interface Props {
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		isDangerous?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		title,
		message,
		confirmLabel = "Confirm",
		cancelLabel = "Cancel",
		isDangerous = true,
		onConfirm,
		onCancel
	}: Props = $props();

	let dialog = $state<HTMLDialogElement>();
	let isBackdropMouseDown = false;

	onMount(() => {
		dialog?.showModal();
	});

	function handleClose() {
		onCancel();
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
		<h3 class="font-serif text-2xl font-bold">{title}</h3>
		<p class="py-4 text-base-content/70">{message}</p>
		<div class="modal-action">
			<button type="button" class="btn btn-ghost" onclick={handleClose}>{cancelLabel}</button>
			<button
				type="button"
				class="btn {isDangerous ? 'btn-error' : 'btn-primary'}"
				onclick={onConfirm}
			>
				{confirmLabel}
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
