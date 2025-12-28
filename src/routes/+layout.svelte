<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { page } from "$app/state";
	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();
	let isHome = $derived(page.url.pathname === "/");
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>D&D Tools - Your D&D companion</title>
</svelte:head>

<div class="min-h-screen bg-base-300 font-sans text-base-content selection:bg-primary/20">
	{#if !isHome}
		<Navbar />
	{/if}
	<main class="container mx-auto">
		{@render children()}
	</main>
</div>
