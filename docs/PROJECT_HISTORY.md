# LearnOS Project History

> This is a curated development history of the LearnOS prototype. It records the product requests, architectural choices, implementation direction, and known gaps from the initial build cycle. It is intentionally not a raw chat transcript and does not contain credentials, private paths, or approval details.

## Purpose and scope

LearnOS began as a local learning application and has been expanded toward a local-first learning operating system for families, small programs, and classroom pilots. The project now combines learner spaces, family participation, teacher tools, administration, modules, calendars, resource libraries, and material-creation tools.

This history should be updated whenever a major capability, architecture decision, security boundary, or known limitation changes.

## Product direction established

The product direction is a role-based learning system with clear, connected responsibilities:

| Role | Intended scope |
| --- | --- |
| Admin | Full visibility and override authority for local people, roles, classes, lessons, records, modules, calendars, resources, and configuration. |
| Teacher | Access to assigned classes and learners; can create learning materials, classes, lessons, and teaching records. Admin can review and edit these records. |
| Parent or Guardian | Linked access to their learners' progress, teachers, program participation, and relevant calendar information. |
| Learner | Age-appropriate access only to assigned learning, activities, modules, and records. |

The prototype currently expresses much of this model in local data and interface logic. Before sensitive records or multi-school use, permissions must be enforced at the storage/service layer as described in the [README roadmap](../README.md#security-and-scale-roadmap).

## Build Week module-library release cycle

During the OpenAI Build Week hackathon, you and Codex began a K–12, two-semester-per-subject module scaffold and a standards-first course-material retrieval system. The work is actively being authored, reviewed, and released through the completion of the hackathon using Codex and GPT-5.6.

The current scaffold contains planning manifests, not finished course material. Each module remains a draft until its standards alignment, unit outline, licensed/approved materials, accessibility and safety review, and learner-facing evidence are completed.

The K–12 scaffold now creates 468 semester manifests: 13 grades, 18 subjects, and two semesters each. Every semester begins with a build-ready four-unit / twelve-lesson blueprint that includes activity, evidence, teacher-review, and raise-your-hand fields. The Living Library is the public-facing visual index for these pathways; it includes unit-roadmap disclosure, a built-in reassignable Pre-K Learning World entry, a searchable library header, curated reading and source shelves, and an optional local state-resource lookup.

The state lookup is a reference directory rather than a state-specific curriculum engine. It lets a parent, teacher, or admin save an official URL for a selected state, grade, and subject; the accompanying Living Library guide explains that there is no federal national curriculum registry and directs readers to official state education authorities and major state-by-state reference resources. The parent source policy continues to control external links. This is a participant project and not an official OpenAI product.

## Development timeline

### 1. People, access, and relationship management

The first major request was to make the Admin panel a real control center for student profiles. The intended controls included:

- editing names and usernames;
- resetting passwords;
- assigning parents/guardians and teachers;
- assigning modules and class access;
- viewing every record stored in the local database;
- allowing Admin to override any record; and
- providing role-appropriate access to the Community, teaching, and learner surfaces.

This established the People & Access area as the ownership point for identity, relationships, rosters, and permissions rather than scattering those controls across the application.

Prototype role accounts were also requested for learner, teacher, parent, and admin flows. These are demonstration accounts only and must be replaced with secure credential provisioning before deployment.

### 2. Permission and group pipeline

The requested permission model connected four ideas:

1. roles grant broad capability;
2. group membership and class assignment grant scoped access;
3. documents inherit access from the people and classes they belong to; and
4. Admin can see and override every local record.

Teachers are intended to inherit access to all of their assigned classes. Parents are intended to inherit access through a linked learner relationship. New classes are intended to become visible in the shared class database, while record-level access remains scoped by role and assignment.

This is the target behavior, not a claim of production-grade authorization. The current implementation still needs server-enforced policy checks, audit history, and full integration coverage.

### 3. Classroom-scale and local-first planning

LearnOS was positioned as a classroom-friendly, lock-screened desktop application that can scale safely. The planned path is:

- prototype: local application/browser data and interface-level role flows;
- classroom pilot: Tauri desktop packaging, encrypted SQLite, credential hashing, session controls, backups, and kiosk/device controls;
- multi-school use: organization-aware backend authorization, encrypted sync, conflict resolution, operational monitoring, privacy review, and managed deployments.

The detailed future plan and risks live in the root [README](../README.md#future-plan) and [known issues table](../README.md#known-issues-and-scale-risks).

### 4. Quality review and navigation repair

A full code and experience review was requested after broken Back links and incomplete flows were found. The review priorities were:

- correct Back behavior per screen;
- remove redundant choices and duplicate paths;
- repair non-functional forms and actions;
- improve empty states and success/error feedback;
- visually inspect pages for crowded layouts, overflowing controls, and unclear flow; and
- make the app easier to use without adding unnecessary explanatory text.

The Teacher Desk received a dedicated improvement pass focused on planning, classroom visibility, saved plans, student progress, resources, and clearer navigation. Several screens still need end-to-end browser/desktop testing; see the current limitations below.

### 5. Calendar model

The Family Hub calendar originally had no working connection to the rest of the app. The agreed model is now:

- one system-wide calendar hub for shared program/class events; and
- a personal calendar for each individual account.

Teacher lesson plans are intended to create class/system events automatically. Calendar editing, cross-account delivery, conflict handling, notifications, and audit history remain future work.

### 6. Creator Studio and Design Studio

The Creator Studio was expanded to support lesson planning, slide/material creation, and save-to-file behavior. A separate Design Studio was brought in from a local project workspace and made available from the top-right area for all roles.

The imported product name was changed from "Aryn Design Studio" to "Design Studio." Its provenance remains internal project material until the original author's repository and license are independently verified. It also currently references Google Fonts at runtime; self-hosting those fonts is required for fully offline classroom deployment.

### 7. Modules, curriculum, classes, and file trees

The original HomeSchool learning files were reframed as built-in module entries within LearnOS. The intended module design is declarative and safe:

- stable module ID, name, version, and description;
- learning goals;
- lesson sequences and suggested duration;
- approved resources;
- learner assignment; and
- existing home sections unlocked by the module.

Modules must not execute downloaded code. They are local records that describe available learning content.

The Admin Module Creator and Curriculum Outline were then re-evaluated because static checkboxes and visual-only file trees did not form a real authoring workflow. The intended end state is a connected workflow where Admin can:

1. create or duplicate a module/template;
2. author folders, classes, lesson plans, files, and learning objectives;
3. assign the resulting module to learners and classes;
4. publish the related materials into Teacher Desk and learner views; and
5. track learner evidence and progress.

This connection is not complete yet. Visual file trees require real file/folder records, actions, permissions, resource attachments, export/restore, and lesson/class integration.

### 8. Teacher Desk and teaching library

Teacher Desk was reorganized around four goals:

- classroom home;
- plans and outlines;
- student progress; and
- teaching library.

The Teaching Library was intended to allow teachers to create folders, upload local resources, associate them with classes, and use those materials in lessons. Reports identified cases where class creation, resource actions, and planning forms showed controls but did not complete the underlying workflow. These remain priority defects until verified with end-to-end tests and persistent data behavior.

### 9. Repository publication

The full workspace was approved for public publication as:

- Repository: https://github.com/SkyeVault/LearnOS
- Visibility: public
- Initial LearnOS release commit: `6bdb364`
- Roadmap and scale-risk documentation commit: `a5cb7c6`

The active branch at the time this history was written is `agent/learnos-initial-release`. The public main branch contains the current initial documentation release.

### 10. Open-source attribution

A complete readable attribution summary was added to the root [README](../README.md#open-source-acknowledgements). It names the principal application, UI, desktop, scheduling, build, test, Rust, and font projects.

The exact dependency inventories remain the source of truth:

- JavaScript: `apps/homeschool-console/package-lock.json`
- Rust: `apps/homeschool-console/src-tauri/Cargo.lock`

## Current known limitations

The product is a prototype. The most important unresolved areas are:

- class creation, roster assignment, planning, resource uploads, and module publishing need full create/edit/delete/error-state verification;
- some pages have historically shown controls that do not persist or complete an action;
- Back navigation and role-to-role paths need journey-level testing;
- document-level permission inheritance is not yet a server-enforced authorization system;
- local storage is not sufficient for protected student records, large files, reliable backup, or multi-user synchronization;
- system and personal calendars need scoped event delivery, notification, conflict, and audit behavior;
- modules do not yet automatically generate all related classes, assignments, lesson events, and evidence records;
- the file-tree experience remains an authoring concept until it controls real resources and permissions;
- Design Studio material handoff into lessons and resource folders needs a reliable, tested path;
- kiosk/lock-screen behavior is a target architecture, not yet an OS-managed security boundary; and
- accessibility, privacy, legal/compliance, disaster recovery, and security testing remain pre-release work.

## Where to update the history

Update this file when changing:

- role and permission rules;
- the persistence or storage model;
- module schema or publishing workflow;
- calendar ownership and sharing rules;
- Creator Studio/Design Studio integration;
- external dependencies or licenses;
- public repository release status; or
- known production risks.

Keep implementation details in source comments and the in-app Software Guide. Keep the durable technical roadmap in the root README. Keep this document focused on why major changes were requested, what was decided, and what still needs to happen.
