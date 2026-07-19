# LearnOS

LearnOS is a local-first learning operating system for families, small programs, and classroom pilots. It brings learner activities, family participation, teaching tools, planning, records, modules, shared calendars, and a design workspace into one desktop application.

> Prototype status: LearnOS is actively evolving. It is suitable for local evaluation and curriculum prototyping, but it is not yet a security-complete school information system.

## What is in LearnOS now

- **Role-based workspaces** for Admin, Teacher, Parent or Guardian, and Learner accounts
- **People and access management** for learners, families, teachers, class rosters, relationships, passwords, and permissions
- **Teacher Desk** for class setup, lesson outlines, planning, progress views, teaching records, and local resources
- **Family Hub** with a shared system calendar and individual personal calendars
- **Creator Studio and Design Studio** for making lesson materials, slide decks, and visual teaching assets
- **Module Library** for local, versioned learning packages assigned to learners
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

## Current local accounts

The prototype includes local Admin, Teacher, Parent, and Learner flows. The initial local Admin account is `admin` with password `12341234`; change this immediately in any real local installation.

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
