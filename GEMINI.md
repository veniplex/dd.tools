# D&D Project Core Instructions

## 1. Interaction & Languages

- **Agent Language**: Antigravity interacts with the user exclusively in **German**.
- **Project Language**: All code, comments, UI text, and documentation within the project must be in **English**.
- **Tone**: Professional, helpful, and proactive.

## 2. Technical Architecture & Performance

- **Framework**: Svelte 5 (Runes: `$state`, `$derived`, `$props`) and SvelteKit.
- **State Management**: Use Svelte 5 runes for local and shared state.
- **Offline / PWA**: The application must work 100% offline as a Progressive Web App (PWA).
- **Local Storage**: All data must be stored locally in the user's browser (IndexedDB via Dexie.js or LocalStorage). No external database dependencies.
- **Type Safety**: Mandatory TypeScript for all logic, components, and data structures.
- **Performance & Security**: Follow modern best practices (fast load times, secure data handling, semantic HTML).
- **SvelteKit Native**: Prioritize Loaders, Actions, and API routes.
- **Responsiveness**: Das Design der Webseite soll auch responsive sein, damit es auf allen Bildschirmgrößen optimal genutzt werden kann. Dazu sollen die von DaisyUI und TailwindCSS zur Verfügung gestellten Mittel genutzt werden.

## 3. UI & Styling (DaisyUI)

- **DaisyUI Primacy**: Use DaisyUI components for all UI elements. Ref: [daisyui.com/llms.txt](https://daisyui.com/llms.txt). Use the `luxury` theme.
- **TailwindCSS**: Use only for micro-adjustments where DaisyUI is insufficient.
- **CSS Policy**: Plain CSS is strictly prohibited.
- **Consistency**: Maintain a unified D&D theme across all tools.
- **Icons**: Use [unplugin-icons](https://github.com/unplugin/unplugin-icons) for all iconography.

## 4. Modularity & Clean Code

- **Component-Driven**: Small, reusable components.
- **File Management**: Refactor large components into sub-components. Group by domain (e.g., `lib/components/combat/`).
- **MCP Usage**: Always use the Svelte MCP server (`list-sections`, `get-documentation`, `svelte-autofixer`) to ensure Svelte 5 best practices.

## 5. Agent Guidelines (MCP)

- **Always Explore First**: Use `list-sections` to find relevant docs before starting complex Svelte tasks.
- **Code Quality**: Run `svelte-autofixer` on every component before delivery until no issues remain.
- **Playground**: Offer a Svelte Playground link for external testing when requested (not for project files).
