# LearnOS Console

This directory contains the LearnOS desktop/web console: the operating-system layer that connects people, permissions, classes, calendars, teaching tools, local resources, and learning records.

The original HomeSchool experience is preserved inside LearnOS as a collection of built-in learning modules. It has not been discarded or replaced by a blank shell. The core console supplies identity, role-aware workspaces, planning, storage, navigation, and administration; modules supply the learner-facing subjects, activities, and learning worlds.

For the product roadmap and limitations, see the [root README](../../README.md). For the curated development record, see [Project History](../../docs/PROJECT_HISTORY.md).

> **OpenAI Build Week status:** The K–12 module library is under active construction and release through the end of this hackathon. LearnOS is a participant project built with Codex and GPT-5.6; template modules must be completed and reviewed before learner assignment.

## What this app provides

- **Admin Corner** - people and access, classes, rosters, module management, records, and program-wide visibility.
- **Teacher Desk** - assigned classrooms, lesson plans, progress views, teaching records, and a local resource shelf.
- **Family Hub** - learner participation, shared program events, and personal calendars.
- **Learner Home** - age-appropriate access to assigned modules, activities, assignments, and evidence.
- **Creator Studio and Design Studio** - lesson-material, slide, and visual asset creation.
- **Local-first records** - prototype data is stored in the local application/browser environment.

## The original app now lives as modules

LearnOS separates the platform from the curriculum.

```text
LearnOS Console (this app)
  |- identity, sessions, local permissions, and role workspaces
  |- classes, rosters, calendar, resources, records, and creator tools
  `- module assignment and navigation

Built-in module collection
  |- early learning activities
  |- music and creative work
  |- mathematics, reading, science, history, geography, and language arts
  |- coding, engineering, physical education, gardening, and homestead learning
  `- Living Library, Learning Commons, Spirit, and Family Archive
```

A module is a local declarative record rather than downloaded executable code. It can define an ID, version, description, goals, lesson sequence, approved resources, and the existing home sections it unlocks. Admin can assign, edit, duplicate, publish, or remove non-core modules; teachers then connect material to classes and lessons.

Module content lives primarily in:

- `src/content/` - built-in subject catalogs, learning packs, and curated module content;
- `src/features/modules.ts` - module records, assignment, and persistence behavior;
- `src/pages/module-manager.ts` - module administration interface; and
- `src/pages/` - learner and staff pages that render the assigned learning spaces.

## Local development

Requirements:

- Node.js 20+
- npm
- Rust and Tauri prerequisites only when building the native desktop app

From this directory:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build       # TypeScript check and production web build
npm run test        # unit tests
npm run tauri build # native desktop installers
```

## Directory guide

```text
src/
  app/        session, local access, themes, kiosk, safety, print helpers
  content/    built-in learning modules and local teaching catalogs
  features/   records, calendars, assignments, resources, modules, slide decks
  pages/      Admin, Teacher, Family, Learner, and studio interfaces
  style.css   shared presentation
  overhaul.css broader layout and visual adjustments

public/
  design-studio.html  standalone Design Studio

src-tauri/
  native Tauri entry point, capabilities, configuration, and desktop assets
```

## Prototype and security boundary

LearnOS is in active prototype development. Role controls, local storage, and interface guards are not sufficient protection for sensitive student data or a shared classroom device. Do not treat this build as a production school information system.

Before deployment beyond local evaluation, the app needs encrypted persistent storage, memory-hard password handling, OS-protected secrets, data-layer authorization, audit logs, backup/restore, managed kiosk or restricted-device controls, accessibility testing, and privacy/compliance review. The [root README](../../README.md#security-and-scale-roadmap) tracks the planned path.

## Design Studio note

Design Studio is a standalone local asset at `public/design-studio.html`. It originated from a local project workspace and was renamed for LearnOS. Confirm its original author and license before separate redistribution. It currently references Google Fonts, so those fonts should be self-hosted for fully offline classroom operation.
