# LearnOS

LearnOS is a local-first learning operating system for families, small programs, and classroom pilots. It brings learner activities, family participation, teaching tools, planning, records, modules, shared calendars, and a design workspace into one desktop application. See the [Project History](https://github.com/SkyeVault/LearnOS/blob/main/docs/PROJECT_HISTORY.md) for the curated build record and known gaps.

> Prototype status: LearnOS is actively evolving. It is suitable for local evaluation and curriculum prototyping, but it is not yet a security-complete school information system.

> **OpenAI Build Week status:** The K–12 library includes completed, locally stored semester pathways across Kindergarten through Grade 12. Each pathway still requires local educator review, adaptation, and approved materials before assignment in a specific program.

## What is in LearnOS now

- **Role-based workspaces** for Admin, Teacher, Parent or Guardian, and Learner accounts
- **People and access management** for learners, families, teachers, class rosters, relationships, passwords, and permissions
- **Teacher Desk** for class setup, lesson outlines, planning, progress views, teaching records, and local resources
- **Family Hub** with a shared system calendar and individual personal calendars
- **Creator Studio and Design Studio** for making lesson materials, slide decks, and visual teaching assets
- **Module Library** for local, versioned learning packages assigned to learners
- **K–12 curriculum library** with 1,638 semester manifests across 13 grades and 63 subjects; each module has four units, twelve lessons, evidence and teacher-review paths, grade-banded goals, and a national-framework retrieval map
- **Built-in Pre-K Learning World** that remains available and can be assigned again at any time
- **Living Library discovery tools** including K–12 pathways, unit roadmaps, searchable shelves, curated resources, and an optional state-resource reference lookup
- **Admin Corner** for program planning, resource management, module authoring, software guidance, and full visibility into local records
- **Local resource shelves** for files, links, folders, class materials, and approved learning sources
- **Learning records, assignments, evidence, and family-ready communication**
- **Local-first storage**: the prototype keeps its records in the local application/browser environment

## How the app fits together

```text
Admin Corner
  ├─ People and Access
  ├─ Classes, rosters, modules, and resource library
  ├─ Creator Studio and Design Studio
  └─ Software Guide

Teacher Desk
  ├─ Classroom home and rosters
  ├─ Lesson plans and calendar
  ├─ Student progress and teaching record
  └─ Teaching Library

Family Hub
  ├─ Linked learner progress
  ├─ Shared calendar
  └─ Personal calendar and participation

Learner Home
  ├─ Assigned modules and subject entries
  ├─ Activities, assignments, and evidence
  └─ Age-appropriate learning spaces
```

## The original HomeSchool app is now a module collection

The original app files are no longer the definition of the product. They are the first set of built-in learning modules inside LearnOS. The core app supplies identity, permissions, classes, records, calendars, creator tools, and resource management; modules supply the learning worlds a learner can enter.

### Built-in original learning modules

| Module area | Examples now available as LearnOS entries |
| --- | --- |
| Early Learning | ABC, Animals, Bubbles, Colors, Counting, Doodle, Music Buttons, Number Hunt, Shapes, Typing, Words |
| Music | Note Names, Note Values, Piano Keys, Staff Explorer, Free Play, Drums |
| Core subjects | Beginner Coding, Mathematics, Reading, Science, History, Geography, Language Arts |
| Creative and practical learning | Art and Creativity, Physical Education, Engineering, Gardening, Homestead Lab, Mindful Movement |
| Shared learning spaces | Living Library, Learning Commons, Spirit, Family Archive |

Each module is a safe local record, not downloaded executable code. A module can declare:

- a stable ID, version, name, and learner-facing description;
- the existing home sections it unlocks;
- learning goals;
- a lesson sequence with objectives and suggested duration; and
- approved resource links.

Admin can create, edit, assign, or remove non-core modules. Teacher lesson plans and locally stored teaching materials connect the module content to actual classes.

## Project layout

```text
apps/homeschool-console/
  src/
    app/        # session, access, local records, themes, safety helpers
    content/    # built-in module content and curated local catalogs
    features/   # calendar, modules, assignments, resources, records, slide decks
    pages/      # Admin, Teacher, Family, Learner, and studio interfaces
  src-tauri/    # Tauri desktop shell and native configuration
  public/       # static assets, including the standalone Design Studio

docs/           # content inventories, source notes, and curriculum references
```

## Run locally

Requirements: Node.js 20+ and npm. Rust and Tauri prerequisites are required only for desktop builds.

```bash
git clone https://github.com/SkyeVault/LearnOS.git
cd LearnOS/apps/homeschool-console
npm install
npm run dev
```

Useful commands:

```bash
npm run build     # production web build
npm run test      # unit tests
npm run tauri build # desktop installers
```

## OpenAI Build Week submission notes

**Track:** Education

LearnOS is a local-first learning operating system that gives families, teachers, and learners one place to plan, assign, document, and review learning. Its completed K–12 curriculum library provides 1,638 locally stored semester pathways across Kindergarten through Grade 12, with learner evidence and teacher-review routes.

### How Codex and GPT-5.6 were used

This project was meaningfully extended during the Build Week submission period with Codex using GPT-5.6. The primary development workflow used Codex to:

- inspect and map the existing module schema and curriculum directory structure;
- design age- and grade-banded learning progressions across 63 subjects;
- author and validate the 1,638 semester manifests, including four units and twelve lessons per module;
- research and record official framework references for NGSS, C3, CSTA, National Core Arts, and SHAPE America; and
- run structural audits, the test suite, and production builds while updating project documentation.

GPT-5.6 accelerated the curriculum-authoring and engineering workflow rather than serving as an unreviewed learner-facing runtime authority. All module pathways remain locally stored planning content and require educator review, local standards alignment, accessibility adaptation, and safety review before assignment. The supporting source record is in [docs/K12_LIBRARY_CITATION_LOG.md](docs/K12_LIBRARY_CITATION_LOG.md).

### Judge testing path

1. Follow [Run locally](#run-locally), then run npm run dev from apps/homeschool-console.
2. Sign in with the local Admin account below, or use the role flows to inspect learner and teacher areas.
3. Open the Module Library / Living Library, select a grade and subject, and inspect a semester path with its units, lessons, evidence options, and review workflow.
4. Run node scripts/scaffold-k12-modules.mjs --check, npm run test, and npm run build from apps/homeschool-console to verify library coverage and application integrity.

For the Build Week submission, provide the /feedback Session ID generated in the primary Codex thread where this work was completed, together with a narrated public demo video of the working application.

## Current local accounts

The prototype includes local Admin, Teacher, Parent, and Learner flows. The initial local Admin account is `admin` with password `12341234`; change this immediately in any real local installation.


## Open-source acknowledgements

LearnOS is built with the following open-source projects. Exact JavaScript package versions and smaller transitive dependencies are recorded in `apps/homeschool-console/package-lock.json`; exact Rust crates are recorded in `apps/homeschool-console/src-tauri/Cargo.lock`.

### Application and desktop runtime

| Project | Used for | License |
| --- | --- | --- |
| [React / React DOM](https://github.com/react/react) | Component-based user interface | MIT |
| [Material UI / MUI X](https://github.com/mui/material-ui) | Components, icons, scheduler, and tree view | MIT |
| [Emotion](https://github.com/emotion-js/emotion) | CSS-in-JS styling used by MUI | MIT |
| [Tauri](https://github.com/tauri-apps/tauri) | Desktop shell, native bridge, CLI, build tooling, and logging plugin | Apache-2.0 OR MIT |
| [read-excel-file](https://github.com/catamphetamine/read-excel-file) | Reading `.xlsx` files | MIT |

### Calendar, scheduling, and interface support

| Project | Used for | License |
| --- | --- | --- |
| [date-fns](https://github.com/date-fns/date-fns) and `@date-fns/tz` | Date and time helpers | MIT |
| [Atlassian Pragmatic Drag and Drop](https://github.com/atlassian/pragmatic-drag-and-drop) | Drag-and-drop support in the scheduling stack | Apache-2.0 |
| [Floating UI](https://github.com/floating-ui/floating-ui) | Positioning menus, popovers, and floating controls | MIT |
| [Popper Core](https://github.com/popperjs/popper-core) | Positioning engine | MIT |
| [Base UI](https://github.com/mui/base-ui) | Accessible UI primitives | MIT |
| [React Transition Group](https://github.com/reactjs/react-transition-group) | UI transitions | BSD-3-Clause |
| [Reselect](https://github.com/reduxjs/reselect) | Memoized state selectors | MIT |
| [Stylis](https://github.com/thysultan/stylis) | CSS preprocessing for Emotion | MIT |
| [tabbable](https://github.com/focus-trap/tabbable) | Keyboard focus management | MIT |
| [clsx](https://github.com/lukeed/clsx) | Conditional CSS class names | MIT |

### Build, test, and type tooling

| Project | Used for | License |
| --- | --- | --- |
| [TypeScript](https://github.com/microsoft/TypeScript) | Type checking and compilation | Apache-2.0 |
| [Vite](https://github.com/vitejs/vite) | Development server and web builds | MIT |
| [Vitest](https://github.com/vitest-dev/vitest) | Unit test runner | MIT |
| [Rollup](https://github.com/rollup/rollup) | Production bundling through Vite | MIT |
| [esbuild](https://github.com/evanw/esbuild) | Fast code transformation and bundling | MIT |
| [Babel](https://github.com/babel/babel) | JavaScript parsing and transforms | MIT |
| [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) | React type definitions | MIT |
| [Chai](https://github.com/chaijs/chai) | Test assertions | MIT |
| [PostCSS](https://github.com/postcss/postcss) | CSS transformation tooling | MIT |
| [Magic String](https://github.com/rich-harris/magic-string) | Source editing and source maps | MIT |
| [Nano ID](https://github.com/ai/nanoid) | Identifier generation | MIT |
| [YAML](https://github.com/eemeli/yaml) | YAML parsing used by tooling | ISC |

### Rust crates used by the native layer

| Project | Used for | License |
| --- | --- | --- |
| [Serde](https://github.com/serde-rs/serde) | Rust serialization and deserialization | MIT OR Apache-2.0 |
| [serde_json](https://github.com/serde-rs/json) | Rust JSON support | MIT OR Apache-2.0 |
| [Rust `log`](https://github.com/rust-lang/log) | Native logging facade | MIT OR Apache-2.0 |

### Fonts and Design Studio provenance

- [Inter](https://github.com/rsms/inter) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) are loaded in the standalone Design Studio through Google Fonts and are released under the SIL Open Font License.
- Design Studio was copied from the project owner's local `aryn-design-studio` workspace and renamed. It is treated as internal project material, not as an independently verified third-party open-source dependency. Its original author and license should be confirmed before any separate redistribution.
- The Google Fonts stylesheet is the one external runtime request currently made by the standalone Design Studio. Self-host the fonts before a fully offline classroom deployment.

## Security and scale roadmap

The current prototype uses local application/browser storage and interface-level access controls. Before handling sensitive student data or operating as a managed school service, LearnOS needs encrypted persistent storage, Argon2id credential handling, OS-protected secrets, server-enforced authorization, audit logs, backups, retention controls, managed kiosk mode, accessibility review, and privacy/legal review.

The target permission model is:

- **Admin** sees and can override all local program records.
- **Teacher** inherits access to assigned classes, learners, lessons, and materials.
- **Parent or Guardian** inherits access through linked learner records and participates in progress, messages, and scheduling.
- **Learner** sees only assigned learning and age-appropriate records.

See the in-app Software Guide and the root `README.md` history for the classroom-scale delivery plan.

## License

MIT


## Future plan

### Next release: make the current workflows dependable

- Finish end-to-end class creation, roster assignment, lesson planning, resource uploads, and module publishing with clear success and error states.
- Connect module lesson sequences directly to Teacher Desk planning, calendars, learner assignments, and progress evidence.
- Add edit, archive, duplicate, export, and restore flows for classes, lessons, resources, and modules.
- Add integration coverage for Admin, Teacher, Parent, and Learner journeys, including Back navigation and empty states.
- Improve the Design Studio handoff so created slides and materials can be attached to lessons and resource folders.


### Future release: learner-owned Theme Page

The Theme Page should help a learner feel ownership without turning personalization into exposure, distraction, or an access-control loophole. Build it as a preview-first, accessibility-aware workspace:

1. **Live preview:** show changes on a small version of the learner’s actual home screen before saving.
2. **Mood-first choices:** offer Calm, Focus, Bright, Cozy, Nature, Night, Creative, and Minimal starting points.
3. **Accessibility in one place:** support text size, high contrast, reduced motion, dyslexia-friendly type, color-safe palettes, and a quiet layout.
4. **Private identity:** allow a local avatar, preferred name styling, colors, and a private badge shelf; never make these public by default.
5. **Subject visual worlds:** allow a learner to use appropriate visual treatments for reading, art, science, and other modules without changing the learning content.
6. **Focus mode:** remove decorative motion, extra cards, and optional prompts when the learner wants to concentrate.
7. **Personal routine layout:** let the learner choose whether today’s work, calendar, favorite modules, reading, projects, or progress appear first.
8. **Achievement shelf:** pin a project, artwork, book, goal, or reflection as learner-owned evidence of growth rather than a public score display.
9. **Encouragement preferences:** let the learner choose gentle reminders, celebrations, quiet check-ins, or no prompts.
10. **Clear customization boundaries:** visibly explain what the learner can change freely and what requires adult approval.

**Required guardrails:** Learners control appearance and routine preferences. Parents/guardians approve external links, profile sharing, sensitive display choices, and public-facing work. Teachers can recommend accessible classroom settings for assigned learners but cannot view or alter private creative content without a defined educational reason. Admin manages themes, role policy, and school-wide accessibility defaults. All preferences remain local-first and role-scoped until the secure service layer exists.

### Classroom pilot: secure local operation

- Move browser-local records into encrypted SQLite within the Tauri app.
- Add proper credential hashing, session expiry, lockout controls, recovery kits, device lock screens, and immutable audit events.
- Deliver managed backups, restore verification, data export, deletion, retention, and locally visible sync status.
- Add classroom session controls, learner-safe kiosk mode, offline content packs, and device-health indicators.

### Multi-school scale: service-enforced permissions

- Introduce organization, school, household, class, and learner scopes enforced by a backend authorization service.
- Sync versioned encrypted records with offline queues and conflict resolution while retaining local-first operation.
- Add managed invitations, SSO and roster imports only where district-approved, plus accessibility and privacy review.
- Establish release channels, migration tools, support operations, incident response, monitoring, and disaster recovery.

## Known issues and scale risks

The following items are known limitations of the current prototype and should be resolved before school or sensitive-record use.

| Area | Current limitation | Required direction |
| --- | --- | --- |
| Authentication | Local prototype accounts and recovery are not a hardened identity system. | Argon2id credentials, OS-protected secrets, secure recovery, throttling, and audit events. |
| Authorization | Some role behavior is implemented in page logic and local data, not a server-enforced policy layer. | Enforce permissions on every record read/write through an authorization service. |
| Data storage | Records and uploaded files use local browser/application storage and can hit quota limits. | Encrypted SQLite locally, durable attachment storage, backups, and migration tooling. |
| Multi-user sync | No production synchronization, conflict resolution, or organization boundary exists yet. | Versioned sync protocol, offline queue, conflict UI, and school/household tenancy. |
| Admin and teacher flows | Some workflows still expose placeholder states, incomplete actions, or weak validation. | Journey-level tests and clear create/edit/archive feedback for every primary workflow. |
| Modules | Module publishing stores local declarative content but does not yet automatically generate all classes, assignments, and calendar events. | Connect module lessons to planning, assignments, resources, outcomes, and learner evidence. |
| File resources | Local upload limits and browser storage rules constrain file handling. | Native managed storage, file type scanning, quota feedback, export, and restore. |
| Calendar | Shared and personal calendars are local; cross-account delivery and conflict handling are incomplete. | Scoped events, notification rules, availability, sync, and audit history. |
| Accessibility | The app needs systematic keyboard, screen-reader, contrast, touch, and reduced-motion testing. | WCAG-informed audit, automated checks, and supported assistive-technology test matrix. |
| Classroom devices | Kiosk behavior is an application goal, not an OS-enforced classroom lock solution. | Managed OS kiosk profiles, signed installers, device policy, and restricted learner accounts. |
| Privacy and compliance | No district compliance posture, data processing agreement, retention policy, or legal review is complete. | Privacy impact assessment, records policy, accessibility review, security testing, and district approval. |
