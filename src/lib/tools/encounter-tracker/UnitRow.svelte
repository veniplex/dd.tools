<script lang="ts">
	import type { Unit, UnitAffiliation } from "./types";
	import IconShield from "~icons/game-icons/shield";
	import IconPlus from "~icons/lucide/plus";
	import IconMinus from "~icons/lucide/minus";
	import IconEdit from "~icons/lucide/pencil";
	import IconCopy from "~icons/lucide/copy";
	import IconTrash from "~icons/lucide/trash-2";
	import IconMore from "~icons/lucide/more-vertical";

	interface Props {
		unit: Unit;
		onUpdate: (unit: Unit) => void;
		onDelete: (id: string) => void;
		onEdit: (unit: Unit) => void;
		onDuplicate: (unit: Unit) => void;
	}

	let { unit, onUpdate, onDelete, onEdit, onDuplicate }: Props = $props();

	const affiliationColors: Record<UnitAffiliation, string> = {
		player: "badge-info",
		ally: "badge-success",
		neutral: "badge-warning",
		enemy: "badge-error"
	};

	const totalCapacity = $derived(unit.maxHp + (unit.tempHp || 0));
	const hpPercentage = $derived((unit.hp / totalCapacity) * 100);
	const thpPercentage = $derived(((unit.tempHp || 0) / totalCapacity) * 100);
	const thpDisplayLeft = $derived(hpPercentage);
	const maxHpThreshold = $derived((unit.maxHp / totalCapacity) * 100);

	const progressColor = $derived.by(() => {
		const relativeHp = (unit.hp / unit.maxHp) * 100;
		if (relativeHp > 50) return "bg-success";
		if (relativeHp > 10) return "bg-warning";
		return "bg-error";
	});

	function adjustHp(amount: number) {
		if (amount < 0) {
			// Damage logic: subtract from THP first
			let damage = Math.abs(amount);
			if (unit.tempHp && unit.tempHp > 0) {
				const thpLoss = Math.min(unit.tempHp, damage);
				unit.tempHp -= thpLoss;
				damage -= thpLoss;
			}
			if (damage > 0) {
				unit.hp = Math.max(0, unit.hp - damage);
			}
		} else {
			// Healing logic
			unit.hp = Math.min(unit.maxHp, unit.hp + amount);
		}
		onUpdate(unit);
	}

	function handleTempHpChange(value: number | Event) {
		if (typeof value === "number") {
			unit.tempHp = (unit.tempHp || 0) + value;
		} else {
			const target = value.target as HTMLInputElement;
			unit.tempHp = parseInt(target.value) || 0;
		}
		onUpdate(unit);
	}
</script>

<div
	class="card grid grid-cols-[0.5fr_3fr_0.5fr_5fr_0.25fr] items-center gap-4 border border-base-200 bg-base-100 px-4 py-2 shadow-sm transition-colors hover:cursor-pointer hover:border-primary hover:bg-base-100/50"
>
	<!-- 1 Initiative -->
	<div class="flex flex-col items-center">
		<div class="text-xl leading-none font-bold">{unit.initiative}</div>
		<div class="text-sm">
			{unit.initiativeBonus >= 0 ? "+" : "-"}{unit.initiativeBonus}
		</div>
	</div>

	<!-- 2 Name -->
	<div class="flex flex-col items-start gap-1 truncate">
		<div class="badge {affiliationColors[unit.affiliation]} shrink-0 badge-xs">
			{unit.affiliation.toUpperCase()}
		</div>
		<h3 class="truncate font-serif text-xl leading-tight font-bold">{unit.name}</h3>
	</div>

	<!-- 3 AC -->
	<div
		class="flex items-center justify-center gap-1 rounded px-2 py-1 text-sm font-bold shadow-inner"
	>
		<IconShield class="size-4" />
		{unit.ac}
	</div>

	<!-- 4 HP Management -->
	<div class="flex h-full items-center gap-1">
		<button
			class="btn btn-ghost btn-sm btn-error"
			onclick={() => adjustHp(-1)}
			aria-label="Subtract 1 HP"
		>
			<IconMinus class="size-4" />
		</button>

		<div
			class="relative h-8 flex-1 overflow-hidden rounded-md border border-base-100 bg-base-300 shadow-inner"
		>
			<!-- HP Bar Content -->
			<div
				class="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out {progressColor}"
				style="width: {hpPercentage}%"
			></div>

			<!-- Temporary HP Section (Placed after Current HP) -->
			<div
				class="absolute top-0 h-full bg-info/75 transition-all duration-300 ease-in-out"
				style="left: {thpDisplayLeft}%; width: {thpPercentage}%"
			></div>

			<!-- HP Text Overlay -->
			<div
				class="absolute inset-0 z-20 flex items-center justify-center text-sm font-bold drop-shadow-sm {(unit.hp /
					unit.maxHp) *
					100 >
				50
					? 'text-success-content'
					: 'text-primary'}"
			>
				{unit.hp} / {unit.maxHp}
				{#if unit.tempHp > 0}
					<span
						class="ml-1 {(unit.hp / unit.maxHp) * 100 > 50
							? 'text-success-content/75'
							: 'text-primary/75'}">(+{unit.tempHp})</span
					>
				{/if}
			</div>
		</div>

		<button
			class="btn btn-ghost btn-sm btn-success"
			onclick={() => adjustHp(1)}
			aria-label="Add 1 HP"
		>
			<IconPlus class="size-4" />
		</button>

		<!-- Temp HP Management -->
		<button
			class="btn btn-ghost btn-sm btn-info"
			onclick={() => handleTempHpChange(1)}
			aria-label="Add 1 Temporary HP"
		>
			<IconPlus class="size-4" />
		</button>
	</div>

	<!-- 5 Actions -->
	<div class="flex items-center justify-end">
		<div class="dropdown dropdown-end">
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div
				tabindex="0"
				role="button"
				class="btn btn-circle h-8 min-h-0 w-8 btn-ghost btn-sm"
				aria-label="Unit Actions"
			>
				<IconMore class="size-4 opacity-50" />
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="dropdown-content menu z-1 w-40 rounded-box border border-base-300 bg-base-200 p-2 shadow-xl"
			>
				<li>
					<button onclick={() => onEdit(unit)} class="gap-2">
						<IconEdit class="size-4" /> Edit
					</button>
				</li>
				<li>
					<button onclick={() => onDuplicate(unit)} class="gap-2">
						<IconCopy class="size-4" /> Duplicate
					</button>
				</li>
				<hr class="my-1 border-base-300" />
				<li>
					<button onclick={() => onDelete(unit.id)} class="gap-2 text-error">
						<IconTrash class="size-4" /> Delete
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>
