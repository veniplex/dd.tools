<script lang="ts">
	import IconDice from "~icons/mdi/dice-d20";
	import IconGithub from "~icons/lucide/github";
	import IconHeart from "~icons/lucide/heart-handshake";
	import IconBook from "~icons/lucide/book-open";
	import IconBug from "~icons/lucide/bug";
</script>

<footer class="footer-center footer footer-horizontal rounded bg-base-200 p-4 text-base-content">
	<nav class=" flex-col gap-4">
		<div class="flex items-center gap-2">
			Open Source tools for Dungeon Masters and Players. Created with <IconHeart
				class="size-5 text-red-400"
			/> for the community.
		</div>
		<div class="grid grid-flow-col gap-8">
			<a
				href="https://github.com/veniplex/dd.tools"
				target="_blank"
				class="flex items-center gap-2 link-hover transition-colors hover:text-primary"
			>
				<IconGithub class="size-5" /> GitHub
			</a>
			<a
				href="https://github.com/veniplex/dd.tools/issues"
				target="_blank"
				class="flex items-center gap-2 link-hover transition-colors hover:text-primary"
			>
				<IconBug class="size-5" /> Report a Bug
			</a>
		</div>
		<div>
			<p>
				Copyright © {new Date().getFullYear()} - All right reserved by dd.tools. Version
				<a href="https://github.com/veniplex/dd.tools/releases"
					>{import.meta.env.VITE_APP_VERSION}</a
				>.
			</p>
		</div>
		<div class="border-t border-base-300 pt-6 text-[10px] leading-relaxed text-base-content/40">
			<!-- Legal Disclaimer -->

			<div class="mx-auto max-w-5xl space-y-2 text-center">
				<p>
					dd.tools is unofficial Fan Content permitted under the Fan Content Policy. Not
					approved/endorsed by Wizards. Portions of the materials used are property of Wizards of
					the Coast. Wizards of the Coast, Dungeons & Dragons, and their logos are trademarks of
					Wizards of the Coast LLC. &copy; Wizards of the Coast LLC.
				</p>
			</div>
		</div>
	</nav>
</footer>
