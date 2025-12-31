<script lang="ts">
	import type { Unit, UnitAffiliation } from "./types";
	import IconShield from "~icons/mingcute/shield-shape-fill";
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

	let editingField = $state<string | null>(null);
	let tempValue = $state<any>(null);

	const noSpinClass =
		"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

	function startEditing(field: string, value: any) {
		editingField = field;
		tempValue = value;
	}

	function stopEditing(save = true) {
		if (save && editingField) {
			(unit as any)[editingField] = tempValue;
			onUpdate(unit);
		}
		editingField = null;
		tempValue = null;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			stopEditing(true);
		} else if (e.key === "Escape") {
			stopEditing(false);
		}
	}

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
	class="card grid grid-cols-[1fr_2fr_1fr_4fr_1fr_1fr] items-center gap-4 border border-base-200 bg-base-100 px-4 py-2 shadow-sm transition-colors hover:cursor-grab hover:border-primary hover:bg-base-100/50 md:grid-cols-[1fr_4fr_1fr_6fr_1fr_1fr] lg:grid-cols-[1fr_4fr_1fr_8fr_1fr_1fr]"
>
	<!-- 1 Initiative -->
	<div class="flex flex-col items-center">
		{#if editingField === "initiative"}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="number"
				class="input input-xs text-center text-xl outline-none {noSpinClass}"
				bind:value={tempValue}
				onblur={() => stopEditing(true)}
				onkeydown={handleKeyDown}
				autofocus
			/>
		{:else}
			<button
				class="text-xl leading-none font-bold hover:cursor-text hover:text-primary"
				onclick={() => startEditing("initiative", unit.initiative)}
				>{unit.initiative + unit.initiativeBonus}</button
			>
		{/if}
		{#if editingField === "initiativeBonus"}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="number"
				class="input input-xs text-center text-xs outline-none {noSpinClass}"
				bind:value={tempValue}
				onblur={() => stopEditing(true)}
				onkeydown={handleKeyDown}
				autofocus
			/>
		{:else}
			<button
				class="text-xs hover:cursor-text hover:text-primary"
				onclick={() => startEditing("initiativeBonus", unit.initiativeBonus)}
			>
				{unit.initiativeBonus >= 0 ? "+" : ""}{unit.initiativeBonus}
			</button>
		{/if}
	</div>

	<!-- 2 Name -->
	<div class="flex min-w-20 flex-col items-start gap-1 truncate">
		{#if editingField === "affiliation"}
			<select
				class="select w-full select-xs outline-none"
				bind:value={tempValue}
				onchange={() => stopEditing(true)}
				onblur={() => stopEditing(true)}
			>
				<option value="player">PLAYER</option>
				<option value="ally">ALLY</option>
				<option value="neutral">NEUTRAL</option>
				<option value="enemy">ENEMY</option>
			</select>
		{:else}
			<button
				class="badge {affiliationColors[unit.affiliation]} shrink-0 badge-xs hover:opacity-80"
				onclick={() => startEditing("affiliation", unit.affiliation)}
			>
				{unit.affiliation.toUpperCase()}
			</button>
		{/if}

		{#if editingField === "name"}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				class="input input-xs text-left text-xl outline-none"
				bind:value={tempValue}
				onblur={() => stopEditing(true)}
				onkeydown={handleKeyDown}
				autofocus
			/>
		{:else}
			<button
				class="truncate font-serif text-xl leading-tight font-bold hover:cursor-text hover:text-primary"
				onclick={() => startEditing("name", unit.name)}
			>
				{unit.name}
			</button>
		{/if}
	</div>

	<!-- 3 AC -->
	<div
		class="group flex items-center justify-center gap-1 rounded px-2 py-1 text-sm font-bold shadow-inner"
	>
		<IconShield class="size-5 min-h-5 min-w-5 group-hover:text-primary" />
		{#if editingField === "ac"}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="number"
				class="input input-xs text-center text-base outline-none {noSpinClass} {noSpinClass}"
				bind:value={tempValue}
				onblur={() => stopEditing(true)}
				onkeydown={handleKeyDown}
				autofocus
			/>
		{:else}
			<button
				class="text-base group-hover:text-primary"
				onclick={() => startEditing("ac", unit.ac)}
			>
				{unit.ac}
			</button>
		{/if}
	</div>

	<!-- 4 HP Management -->
	<div class="flex flex-row flex-wrap items-center justify-between gap-1 md:flex-nowrap">
		<button
			class="btn order-2 btn-ghost btn-sm btn-error md:order-1"
			onclick={() => adjustHp(-1)}
			aria-label="Subtract 1 HP"
		>
			<IconMinus class="size-4" />
		</button>

		<!-- HP Bar -->
		<div
			class="relative order-1 h-8 w-full overflow-hidden rounded-md border border-base-100 bg-base-300 shadow-inner md:order-2 md:flex-1"
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
				{#if editingField === "hp"}
					<!-- svelte-ignore a11y_autofocus -->
					<input
						type="number"
						class="input input-xs w-10 text-center text-base outline-none {noSpinClass}"
						bind:value={tempValue}
						onblur={() => stopEditing(true)}
						onkeydown={handleKeyDown}
						autofocus
					/>
				{:else}
					<button
						class="text-base hover:cursor-text hover:text-primary"
						onclick={() => startEditing("hp", unit.hp)}
					>
						{unit.hp}
					</button>
				{/if}
				<span class="mx-1">/</span>
				{#if editingField === "maxHp"}
					<!-- svelte-ignore a11y_autofocus -->
					<input
						type="number"
						class="input input-xs w-10 text-center text-base outline-none {noSpinClass}"
						bind:value={tempValue}
						onblur={() => stopEditing(true)}
						onkeydown={handleKeyDown}
						autofocus
					/>
				{:else}
					<button
						class="text-base hover:cursor-text hover:text-primary"
						onclick={() => startEditing("maxHp", unit.maxHp)}
					>
						{unit.maxHp}
					</button>
				{/if}

				{#if unit.tempHp > 0 || editingField === "tempHp"}
					<span class="ml-1 flex items-center font-normal">
						({#if editingField === "tempHp"}
							<!-- svelte-ignore a11y_autofocus -->
							<input
								type="number"
								class="input input-xs w-10 text-center text-base outline-none {noSpinClass}"
								bind:value={tempValue}
								onblur={() => stopEditing(true)}
								onkeydown={handleKeyDown}
								autofocus
							/>
						{:else}
							<button
								class="text-base hover:cursor-text hover:text-primary {(unit.hp / unit.maxHp) *
									100 >
								50
									? 'text-blue-700'
									: 'text-blue-300'}"
								onclick={() => startEditing("tempHp", unit.tempHp)}
							>
								+{unit.tempHp}
							</button>
						{/if})
					</span>
				{/if}
			</div>
		</div>

		<button
			class="btn order-3 btn-ghost btn-sm btn-success md:order-3"
			onclick={() => adjustHp(1)}
			aria-label="Add 1 HP"
		>
			<IconPlus class="size-4" />
		</button>
	</div>

	<!-- 5 Temp HP -->
	<div class="flex justify-center">
		<button
			class="btn btn-ghost btn-sm btn-info"
			onclick={() => handleTempHpChange(1)}
			aria-label="Add 1 Temporary HP"
		>
			<IconPlus class="size-4" />
		</button>
	</div>

	<!-- 6 Actions -->
	<div class="flex items-center justify-end">
		<div class="dropdown dropdown-end">
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div tabindex="0" role="button" class="btn btn-ghost btn-sm" aria-label="Unit Actions">
				<IconMore class="size-4" />
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
