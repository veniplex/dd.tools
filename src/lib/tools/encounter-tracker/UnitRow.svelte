<script lang="ts">
	import type { Unit, UnitAffiliation } from "./types";
	import IconShield from "~icons/game-icons/shield";
	import IconHeart from "~icons/game-icons/heart-plus";
	import IconFist from "~icons/game-icons/fist";

	interface Props {
		unit: Unit;
		onUpdate: (unit: Unit) => void;
		onDelete: (id: string) => void;
	}

	let { unit, onUpdate, onDelete }: Props = $props();

	const affiliationColors: Record<UnitAffiliation, string> = {
		player: "badge-primary",
		ally: "badge-secondary",
		neutral: "badge-ghost",
		enemy: "badge-error"
	};

	function handleHpChange(event: Event) {
		const target = event.target as HTMLInputElement;
		unit.hp = parseInt(target.value);
		onUpdate(unit);
	}
</script>

<div class="card flex flex-row items-center gap-4 border border-base-300 bg-base-200 p-4 shadow-sm">
	<div class="flex flex-col items-center gap-1">
		<div class="badge {affiliationColors[unit.affiliation]} text-xs font-bold uppercase">
			{unit.affiliation}
		</div>
		<div class="text-xl font-bold">#{unit.initiative}</div>
	</div>

	<div class="flex flex-1 flex-col truncate">
		<h3 class="truncate font-serif text-lg font-bold">{unit.name}</h3>
		<div class="flex gap-2">
			<span class="flex items-center gap-1 text-xs text-base-content/70">
				<IconShield class="h-3 w-3" /> AC: {unit.ac}
			</span>
			<span class="flex items-center gap-1 text-xs text-base-content/70">
				<IconFist class="h-3 w-3" /> Init: {unit.initiativeBonus >= 0
					? "+"
					: ""}{unit.initiativeBonus}
			</span>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<div class="flex flex-col items-end gap-1">
			<div class="flex items-center gap-2">
				<IconHeart class="h-4 w-4 text-error" />
				<input
					type="number"
					value={unit.hp}
					onchange={handleHpChange}
					class="input input-sm w-16 input-ghost text-right font-mono text-lg"
				/>
				<span class="text-base-content/50">/ {unit.maxHp}</span>
			</div>
			<progress class="progress w-32 progress-error" value={unit.hp} max={unit.maxHp}></progress>
		</div>

		<button class="btn btn-circle text-error btn-ghost btn-sm" onclick={() => onDelete(unit.id)}>
			✕
		</button>
	</div>
</div>
