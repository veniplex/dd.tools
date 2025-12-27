<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>D&D Tools - Your D&D companion</title>
</svelte:head>

<div class="min-h-screen bg-base-300 font-sans text-base-content selection:bg-primary/20">
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
