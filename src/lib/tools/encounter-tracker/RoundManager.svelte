<script lang="ts">
	import { encounterStore } from "./db.svelte";
	import type { Encounter, Unit } from "./types";
	import IconPlay from "~icons/heroicons/play-solid";
	import IconPause from "~icons/heroicons/pause";
	import IconStop from "~icons/heroicons/stop";
	import IconChevronRight from "~icons/heroicons/chevron-right";
	import IconChevronLeft from "~icons/heroicons/chevron-left";
	import IconReset from "~icons/system-uicons/reset";
	import IconDice from "~icons/mdi/dice-d20";

	let { encounter } = $props<{ encounter: Encounter }>();

	let timerInterval: number | null = null;

	let sortedUnits = $derived(
		[...encounter.units].sort((a, b) => {
			const totalA = a.initiative + a.initiativeBonus;
			const totalB = b.initiative + b.initiativeBonus;
			if (totalB !== totalA) return totalB - totalA;
			if (b.initiativeBonus !== a.initiativeBonus) return b.initiativeBonus - a.initiativeBonus;
			return a.name.localeCompare(b.name);
		})
	);

	let allInitiativesSet = $derived(
		encounter.units.length > 0 && encounter.units.every((u: Unit) => u.initiative > 0)
	);

	function formatTime(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
		return `${m}:${s.toString().padStart(2, "0")}`;
	}

	async function rollNpcs() {
		const updatedUnits = encounter.units.map((unit: Unit) => {
			if (unit.affiliation !== "player") {
				const roll = Math.floor(Math.random() * 20) + 1;
				return { ...unit, initiative: roll };
			}
			return unit;
		});

		await encounterStore.updateEncounter({
			...encounter,
			units: updatedUnits
		});
	}

	async function startEncounter() {
		// Find first unit in initiative order based on current units
		const firstUnit = [...encounter.units].sort((a, b) => b.initiative - a.initiative)[0];

		await encounterStore.updateEncounter({
			...encounter,
			status: "active",
			round: 1,
			currentTurn: firstUnit?.id,
			timerSeconds: encounter.timerSeconds ?? 0
		});
	}

	async function pauseEncounter() {
		await encounterStore.updateEncounter({
			...encounter,
			status: "paused"
		});
	}

	async function resumeEncounter() {
		await encounterStore.updateEncounter({
			...encounter,
			status: "active"
		});
	}

	async function stopEncounter() {
		await encounterStore.updateEncounter({
			...encounter,
			status: "stopped",
			round: 0,
			currentTurn: undefined
		});
	}

	async function nextTurn() {
		if (sortedUnits.length === 0) return;

		const currentIndex = sortedUnits.findIndex((u) => u.id === encounter.currentTurn);
		let nextIndex = currentIndex + 1;
		let nextRound = encounter.round;

		if (nextIndex >= sortedUnits.length) {
			nextIndex = 0;
			nextRound++;
		}

		await encounterStore.updateEncounter({
			...encounter,
			round: nextRound,
			currentTurn: sortedUnits[nextIndex].id
		});
	}

	async function previousTurn() {
		if (sortedUnits.length === 0) return;

		const currentIndex = sortedUnits.findIndex((u) => u.id === encounter.currentTurn);
		let prevIndex = currentIndex - 1;
		let prevRound = encounter.round;

		if (prevIndex < 0) {
			if (prevRound > 1) {
				prevIndex = sortedUnits.length - 1;
				prevRound--;
			} else {
				prevIndex = 0; // Stay at first unit if round is 1
			}
		}

		await encounterStore.updateEncounter({
			...encounter,
			round: prevRound,
			currentTurn: sortedUnits[prevIndex].id
		});
	}

	async function resetUnits(type: "npc" | "player" | "all") {
		const updatedUnits = encounter.units.map((unit: Unit) => {
			const isMatch =
				type === "all" ||
				(type === "npc" && unit.affiliation !== "player") ||
				(type === "player" && unit.affiliation === "player");

			if (isMatch) {
				return { ...unit, initiative: 0, hp: unit.maxHp, tempHp: 0 };
			}
			return unit;
		});

		await encounterStore.updateEncounter({
			...encounter,
			units: updatedUnits
		});
	}

	$effect(() => {
		if (encounter.status === "active") {
			timerInterval = window.setInterval(async () => {
				await encounterStore.updateEncounter({
					...encounter,
					timerSeconds: (encounter.timerSeconds ?? 0) + 1
				});
			}, 1000);
		} else {
			if (timerInterval) {
				clearInterval(timerInterval);
				timerInterval = null;
			}
		}

		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});
</script>

<div class="card mb-4 overflow-visible bg-base-200 shadow-xl">
	<div class="card-body p-4">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<!-- Round & Timer Info -->
			<div class="flex items-center gap-6">
				{#if encounter.status !== "stopped" || encounter.round > 0}
					<div class="flex flex-col">
						<span class="text-xs font-bold tracking-wider text-base-content/60 uppercase"
							>Round</span
						>
						<span class="font-serif text-3xl font-bold text-primary">{encounter.round}</span>
					</div>
					{#if encounter.timerSeconds !== undefined && encounter.status !== "stopped"}
						<div class="flex flex-col border-l border-base-content/10 pl-6">
							<span class="text-xs font-bold tracking-wider text-base-content/60 uppercase"
								>Time</span
							>
							<span class="font-mono text-3xl font-bold">{formatTime(encounter.timerSeconds)}</span>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Main Controls -->
			<div class="flex items-center gap-2">
				{#if encounter.status === "stopped"}
					<div class="flex items-center gap-2">
						<button
							class="btn btn-primary {allInitiativesSet ? 'btn-outline' : ''}"
							onclick={rollNpcs}
						>
							<IconDice class="size-5" />
							{allInitiativesSet ? "" : "Roll initiative"}
						</button>
						<button
							class="btn btn-primary {allInitiativesSet ? '' : 'hidden'}"
							onclick={startEncounter}
							disabled={!allInitiativesSet}
							title="Start Encounter"
						>
							<IconPlay class="size-5" />
							Start
						</button>
						<div class="dropdown dropdown-end">
							<button tabindex="0" class="btn btn-outline">
								<IconReset class="size-5 stroke-2" />
							</button>
							<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
							<ul
								tabindex="0"
								class="dropdown-content menu z-30 w-52 rounded-box border border-base-100 bg-base-300 p-2 shadow-xl"
							>
								<li><button onclick={() => resetUnits("npc")}>Reset NPCs</button></li>
								<li><button onclick={() => resetUnits("player")}>Reset Players</button></li>
								<li><button onclick={() => resetUnits("all")}>Reset All</button></li>
							</ul>
						</div>
					</div>
				{:else if encounter.status === "active"}
					<div class="flex items-center gap-2">
						<div class="btn-group join">
							<button class="btn join-item btn-ghost" onclick={previousTurn} title="Previous Turn">
								<IconChevronLeft class="size-5" />
							</button>
							<button class="btn join-item btn-ghost" onclick={nextTurn} title="Next Turn">
								<IconChevronRight class="size-5" />
							</button>
						</div>

						<button class="btn btn-warning" onclick={pauseEncounter}>
							<IconPause class="size-5" /> Pause
						</button>

						<button class="btn btn-outline btn-error" onclick={stopEncounter}>
							<IconStop class="size-5" /> Stop
						</button>
					</div>
				{:else if encounter.status === "paused"}
					<div class="flex items-center gap-2">
						<div class="btn-group join cursor-not-allowed opacity-50">
							<button class="btn pointer-events-none join-item btn-ghost">
								<IconChevronLeft class="size-5" />
							</button>
							<button class="btn pointer-events-none join-item btn-ghost">
								<IconChevronRight class="size-5" />
							</button>
						</div>

						<button class="btn btn-primary" onclick={resumeEncounter}>
							<IconPlay class="size-5" /> Resume
						</button>

						<button class="btn btn-outline btn-error" onclick={stopEncounter}>
							<IconStop class="size-5" /> Stop
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
