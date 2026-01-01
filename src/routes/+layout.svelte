<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { page } from "$app/state";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";

	let { children } = $props();
	let isHome = $derived(page.url.pathname === "/");
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>D&D Tools - Your D&D companion</title>
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-base-300 font-sans text-base-content selection:bg-primary/20"
>
	{#if !isHome}
		<Navbar />
	{/if}
	<main class="container mx-auto grow">
		{@render children()}
	</main>
	{#if isHome}
		<Footer />
	{/if}
</div>
