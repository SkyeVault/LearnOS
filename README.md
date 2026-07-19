# LearnOS 0.26

A desktop homeschool app for kids built with Tauri and TypeScript. No internet required after install — everything runs locally on your machine.

---

## Subjects

### Early Learning
Designed for ages 1–3. A hub of interactive activities:

- **ABC** — explore the alphabet and play a letter matching game
- **Animals** — tap animals to hear their name and sound spoken aloud
- **Bubbles** — sensory bubble-popping activity
- **Colors** — learn color names with visual feedback
- **Counting** — interactive counting practice
- **Doodle** — free-draw doodle canvas
- **Music Buttons** — press Do–Re–Mi scale buttons that play real tones
- **Number Hunt** — find and tap numbers as they appear
- **Shapes** — learn mode and quiz mode for basic shapes
- **Typing** — press any key to see colorful animated letters
- **Words** — early word recognition activity

### Music
A full music education hub:

- **Note Names** — learn note names positioned on the staff
- **Note Values** — whole, half, and quarter note recognition
- **Piano Keys** — identify piano keys in a scored quiz game
- **Staff Explorer** — interactive grand staff with piano keyboard
- **Free Play** — keyboard-mapped piano for open-ended play
- **Drums** — synthesized drum kit

### Beginner Coding
An introduction to programming concepts through a visual file tree explorer and coding challenges with a score tracker.

### Mathematics
Arithmetic practice with randomized problems and a running score.

### Reading
Word recognition and early reading activities.

### Science
Science concept explorer with visual cards.

### History
History quiz with questions and emoji prompts.

### Geography
All 50 US states displayed in a grid with abbreviations and capitals. Click any state to learn more.

### Language Arts
Rhyming word quiz — find the word that rhymes with the prompt. Includes score tracking and feedback.

### Art & Creativity
Color mixing lab — pick two colors from a palette and see what they make together.

### Physical Education
Exercise activity cards with a built-in timer and completion counter to track reps or sets.

### Engineering
Simple machines quiz covering tools and mechanical concepts.

---

## Tech Stack

- **[Tauri v2](https://tauri.app)** — native desktop app shell (Rust)
- **TypeScript + Vite** — frontend
- **Web Audio API** — all music and sound effects generated in-browser, no audio files needed
- **Web Speech API** — text-to-speech for the Animals page

No external services, no accounts, no telemetry.

---

## Installation

Download the latest release for your platform:

| Platform | File |
|----------|------|
| Linux (any distro) | `.AppImage` — mark executable and run |
| Ubuntu / Debian | `.deb` — install with `sudo dpkg -i` |
| Fedora / RHEL | `.rpm` |

After installing the `.deb` or `.rpm`, the app appears in your applications menu.

---

## Building from Source

**Requirements:** [Node.js](https://nodejs.org), [Rust](https://rustup.rs), and [Tauri prerequisites](https://tauri.app/start/prerequisites/)

```bash
git clone https://github.com/SkyeVault/HomeSchool-v1.git
cd HomeSchool-v1/apps/homeschool-console
npm install
npm run tauri build
```

Built installers will be in `src-tauri/target/release/bundle/`.

---

## License

MIT

---

## Owner recovery and pre-release access

New installations start with the local Admin account `admin` and initial password `12341234`. Change this password after the first sign-in.

For existing local homes, the sign-in screen offers **Recover local owner account**. It requires either the original owner password from setup or a legacy guardian PIN, then permits a new Admin password. This recovery preserves the learning home and records; it does not create a universal reset password. If neither recovery secret is available, there is intentionally no account bypass—resetting local application data is the remaining recovery option.

## Public-release security plan

LearnOS 0.26 is a prototype, not a security-complete public or school deployment. Before a public release, the recovery and identity model needs:

- A one-time, high-entropy recovery kit generated during setup, with a printable/offline copy controlled by the owner.
- Password hashing designed for credentials (Argon2id or an equivalent platform-supported KDF), encrypted persistent storage, and operating-system-protected secrets.
- Separate Administrator, Parent/Guardian, Teacher, and Learner permissions enforced at the data layer—not only in the interface.
- Login throttling, account lockout/recovery auditing, signed backup and restore, and explicit data export/deletion controls.
- A vetted module-signing and review process before third-party modules can be installed.
- Accessibility, privacy, child-safety, and district legal review before use with sensitive student records or public-school deployments.

## Teaching Platform Direction

LearnOS 0.26 is evolving from a local homeschool app into a **modular, local-first teaching platform**. Children can use the learner-facing activities, assignments, scrapbook, and learning record; adults can use the same installation to plan instruction, capture evidence, and organize a small class or weekend workshop.

### Teacher-centric workflow

```text
Roster → attendance → lesson/outline → activity or project → observation/assessment → family update → progress report
```

Current adult-facing tools include Parent Desk, Assignment Desk, Module Library, Engagement Journal, Collaborative Project Board, local LMS course mapping, Creator Studio, and the child Progress Scrapbook.

Planned teacher modules include Class Roster & Attendance, Gradebook/Rubrics, Family Communication, Family Requirements Binder, Completion Map, and Progress Report export. Attendance and assessment records are planned; they are not yet a substitute for a school information system.

### Modular classrooms

A module can package a grade band, subject, specialized program, or teaching workflow. A future reviewed package includes a manifest, curriculum map, resource inventory and licenses, lesson/assignment templates, learner evidence prompts, and progress-report language. Modules can be installed, assigned to learners, and removed when no longer needed.

### Mobile classroom and Raspberry Pi direction

The app is designed around local-first use: a teacher can operate without a cloud account after installation, then add approved resources or connections when available. A mobile classroom deployment can pair a small Linux computer (including a Raspberry Pi-class device) with a display/projector, keyboard/mouse or touch screen, USB microphone/camera, speakers, and local Wi-Fi.

Raspberry Pi support is a deployment goal, not a currently tested release target. It requires an ARM Linux build, device testing, reliable local storage/backup, and a classroom-friendly launcher. Planned A/V modules will support presentation output, microphone/camera input, document camera/visualizer workflows, and optional local AI services; no A/V device integration is currently claimed as implemented.

### Public-school readiness

A district deployment requires role-based access, authentication, encryption, backups, audit logs, retention/deletion controls, parent record access, accessibility testing, district-approved integrations, and privacy review. Do not connect student records to third-party services until the district has approved the vendor and data-sharing arrangement.

### Upgradeable modules

**LearnOS 0.26** uses versioned module manifests so grade-band, subject, and specialist modules can evolve independently of the core app. A future module upgrade workflow will compare manifest versions, preserve learner evidence and assignments, show a parent-facing change summary, back up the previous module state, and allow rollback. Module upgrades must never silently remove family records or replace parent-created curriculum.


## Classroom-scale build plan

LearnOS should remain fluid and local-first while gaining the controls required for supervised classroom use. The current browser-local prototype is the foundation, not the security boundary: a classroom release needs a signed desktop app, encrypted data, and server-verified authorization.

### Target operating model

    District or school Admin
      manages every account, class, module, lesson, record, audit event, and override
    Teacher
      inherits access to assigned classes, enrolled learners, and class documents
    Parent or Guardian
      inherits view and participation access through linked learner records
    Learner
      sees only assigned learning, submissions, and age-appropriate progress

Every shared record, including classes, lessons, assignments, teaching records, messages, and community posts, will carry an owner, school or household scope, class and learner audience, and audit history. The authorization service resolves group membership from those relationships on every read and write; Admin always has an explicit override.

### Delivery phases

1. **Prototype hardening: current app to secure local pilot**
   - Replace plain local-storage records with encrypted SQLite in the Tauri app.
   - Use Argon2id passwords, OS keychain-protected device keys, session expiry, lockout and throttling, and an administrator-controlled lock screen.
   - Finish shared authorization for classes, lessons, assignments, evidence, messages, modules, and Family Hub data.
   - Add immutable local audit events for sign-in, permission changes, overrides, exports, and record edits.
   - Add locked-kiosk mode so a learner session cannot leave its workspace without adult sign-in.

2. **Single-school pilot: trusted sync without losing local-first use**
   - Introduce school and organization boundaries plus a backend API that authorizes every request; clients never decide final permissions.
   - Sync encrypted, versioned records when connected, with offline queues, conflict handling, and visible sync status.
   - Add managed Admin, Teacher, Parent or Guardian, and Learner identities, invitations, and recovery flows.
   - Deliver family access to linked learner progress, teacher messages, assignments, attendance, and approved participation tools.
   - Give Admin a complete data console for roster, classes, lessons, modules, records, permission overrides, audit history, export, and retention actions.

3. **Classroom operations: managed devices and safe daily use**
   - Add teacher-controlled class sessions, learner device join codes, attendance, classroom launch and lock, and device-health indicators.
   - Support school-managed Tauri installers, signed updates, configuration profiles, offline content packs, and backup and restore drills.
   - Add accessibility verification, moderation and reporting, records retention, deletion requests, and configurable data residency.
   - Test low-bandwidth and offline operation, including a local classroom hub for unreliable internet.

4. **District readiness: integrations and compliance**
   - Support SSO and roster imports only through district-approved standards and data-processing agreements.
   - Complete privacy, security, accessibility, incident-response, penetration-testing, and disaster-recovery reviews.
   - Establish support operations, release channels, migration tooling, monitoring, and documented service-level expectations.

### Non-negotiable safety rules

- Authorization is enforced by the data service, not hidden buttons or client-side routes.
- Admin actions are auditable; overrides retain the previous value and actor, time, and reason.
- Teacher access is automatically scoped to assigned classes; parent access is automatically scoped to linked learners.
- New classes are shared school records, visible to Admin immediately, and grant class-scoped access only to their assigned teacher and linked families.
- Learner devices use a locked workspace and do not expose administrative navigation, other learner data, or browser-level escape routes.
- Backups, exports, and deletion are explicit administrator actions with retention rules, not silent side effects of module updates.
