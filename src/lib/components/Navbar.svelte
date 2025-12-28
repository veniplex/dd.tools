<script lang="ts">
	import { page } from '$app/state';
	import IconDice from "~icons/mdi/dice-d20";

	let segments = $derived(page.url.pathname.split('/').filter(Boolean));

	function formatSegment(segment: string) {
		return segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	let breadcrumbs = $derived(
		segments.map((segment, index) => {
			const path = `/${segments.slice(0, index + 1).join('/')}`;
			return {
				name: formatSegment(segment),
				path
			};
		})
	);
</script>

<nav class="navbar bg-transparent container mx-auto px-4 py-2">
	<div class="navbar-start">
		<a href="/" class="flex items-center gap-2 no-underline group">
			<IconDice class="size-8 text-primary group-hover:scale-110 transition-transform" />
			<span class="font-serif text-2xl font-bold hidden sm:inline-block">
				D<span class="text-sm">&</span>D Tools
			</span>
		</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<div class="text-sm breadcrumbs">
			<ul>
				<li><a href="/">Start</a></li>
				{#each breadcrumbs as crumb, i (crumb.path)}
					<li>
						{#if i === breadcrumbs.length - 1}
							<span class="opacity-60 hover:no-underline hover:cursor-default">{crumb.name}</span>
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
<div class="lg:hidden container mx-auto px-4 pt-2">
	<div class="text-xs breadcrumbs overflow-x-auto whitespace-nowrap">
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
