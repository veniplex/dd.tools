<script lang="ts">
	import type { ToolMetadata } from "$lib/tools/types";

	let {
		title,
		description,
		icon: Icon,
		slug,
		status,
		version
	}: Partial<ToolMetadata> &
		Pick<ToolMetadata, "title" | "description" | "icon" | "slug" | "status" | "version"> = $props();

	const statusConfig = $derived({
		released: { style: "badge badge-ghost", text: version ? `v${version}` : "" },
		beta: { style: "badge badge-info", text: "BETA" },
		planned: { style: "badge badge-accent badge-soft", text: "PLANNED" }
	});
</script>

<svelte:element
	this={status === "planned" ? "div" : "a"}
	href={`/${slug}`}
	class="card transform overflow-hidden border border-primary/25 {status !== 'planned'
		? 'hover:scale-105 hover:border-primary'
		: 'cursor-default opacity-80'} bg-base-100 shadow-xl transition-transform duration-300"
>
	<div class="card-body items-center text-center">
		<div
			class="mb-2 text-5xl {status !== 'planned'
				? 'text-primary'
				: 'text-primary/50'} transition-transform duration-300"
		>
			<Icon />
		</div>
		<h2 class="card-title font-serif text-2xl tracking-wide">{title}</h2>
		<p class="text-sm text-primary {status !== 'planned' ? '' : 'opacity-70'}">{description}</p>
		<div class="mt-4 card-actions h-6 w-full justify-center">
			<div class={`${statusConfig[status].style} font-medium`}>
				{statusConfig[status].text}
			</div>
		</div>
	</div>
</svelte:element>
