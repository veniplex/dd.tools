# dd.tools 🐉🎲

[![Svelte](https://img.shields.io/badge/Svelte-5.0-ff3e00?logo=svelte)](https://svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![DaisyUI](https://img.shields.io/badge/daisyUI-5.0-5551ff?logo=daisyui)](https://daisyui.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, offline-first, and privacy-focused suite of tools for Dungeons & Dragons (5th Edition), built for Dungeon Masters and Players who value speed, reliability, and data ownership.

## ✨ Core Philosophy

- **Privacy First**: All your data stays on your device. We use IndexedDB for local storage; no cloud sync, no tracking, no account required.
- **Offline Capable**: Built as a PWA (Progressive Web App). Once loaded, it works anywhere—even in the deepest dungeons without Wi-Fi.
- **Modern Tech**: Leveraging the latest Svelte 5 "Runes" for a snappy, reactive user experience.

## 🛠️ Included Tools

### Encounter Tracker

A robust combat management tool designed to streamline initiative and HP tracking.

- **Dynamic Initiative**: Sort units by roll, bonus, or manual tie-breakers.
- **Health Management**: Inline editing for HP, Max HP, and Temporary HP with visual health bars.
- **Encounter Groups**: Organize your prep with custom groups and drag-and-drop organization.
- **Persistence**: Auto-saves every change instantly via Dexie.js.

## 🚀 Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev) (Runes: `$state`, `$derived`, `$props`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) & [daisyUI](https://daisyui.com)
- **Database**: [Dexie.js](https://dexie.org) (IndexedDB wrapper)
- **Iconography**: [Iconify](https://iconify.design) via `unplugin-icons`
- **Build Tool**: [Vite](https://vitejs.dev)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/veniplex/dd.tools.git
   cd dd.tools
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## ⚖️ Legal Disclaimer

dd.tools is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. Wizards of the Coast, Dungeons & Dragons, and their logos are trademarks of Wizards of the Coast LLC. &copy; Wizards of the Coast LLC.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
