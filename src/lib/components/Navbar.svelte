<script lang="ts">
	import { page } from "$app/state";
	import IconDice from "~icons/mdi/dice-d20";
	import { encounterStore } from "$lib/tools/encounter-tracker/db.svelte";

	let segments = $derived(page.url.pathname.split("/").filter(Boolean));

	function formatSegment(segment: string) {
		// Check if segment is an encounter ID
		if (segments.includes("encounter-tracker") && segment.length <= 8) {
			const encounter = encounterStore.encounters.find((e) => e.id === segment);
			if (encounter) return encounter.name;
		}

		return segment
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	let breadcrumbs = $derived(
		segments.map((segment, index) => {
			const path = `/${segments.slice(0, index + 1).join("/")}`;
			return {
				name: formatSegment(segment),
				path
			};
		})
	);
</script>

<nav class="navbar container mx-auto bg-transparent px-4 py-2">
	<div class="navbar-start">
		<a href="/" class="group flex items-center gap-2 no-underline">
			<IconDice class="size-8 text-primary transition-transform group-hover:scale-110" />
			<span class="hidden font-serif text-2xl font-bold sm:inline-block">
				D<span class="text-sm">&</span>D Tools
			</span>
		</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<div class="breadcrumbs text-sm">
			<ul>
				<li><a href="/">Start</a></li>
				{#each breadcrumbs as crumb, i (crumb.path)}
					<li>
						{#if i === breadcrumbs.length - 1}
							<span class="opacity-60 hover:cursor-default hover:no-underline">{crumb.name}</span>
						{:else}
							<a href={crumb.path}>{crumb.name}</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="navbar-end">
		<!-- Space for future actions like settings or user profile -->
	</div>
</nav>

<!-- Mobile Breadcrumbs (visible below lg) -->
<div class="container mx-auto px-4 pt-2 lg:hidden">
	<div class="breadcrumbs overflow-x-auto text-xs whitespace-nowrap">
		<ul>
			<li><a href="/">Home</a></li>
			{#each breadcrumbs as crumb, i (crumb.path)}
				<li>
					{#if i === breadcrumbs.length - 1}
						<span class="opacity-60">{crumb.name}</span>
					{:else}
						<a href={crumb.path}>{crumb.name}</a>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
