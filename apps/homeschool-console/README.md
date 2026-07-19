
### Adult workspace polish

Parent Desk is designed as an adult planning workspace rather than a child activity screen. Its responsive tool rail provides direct access to Creator Studio, Assignment Desk, Modules, Teacher Tools, Family Hub, and Themes. The planning area prioritizes curriculum decisions, learner context, and next actions while keeping secondary controls organized for desktop and smaller screens.

## Pre-release security and guardrails

LearnOS is a pre-release prototype. It now restores a guardian-PIN gate before Parent Desk and uses an offline-first content security policy. External reading and resource links remain parent-approved and off by default.

These guardrails protect ordinary in-app navigation; they do **not** make browser local storage or a shared desktop account a secure student-data boundary. A child with operating-system access, developer tools, or direct filesystem access can potentially bypass application controls. Before child-only or school deployment, LearnOS needs encrypted persistent storage, protected secrets, authenticated roles, audit logging, backup/restore, and an OS-managed kiosk or restricted child account. Do not treat this version as a public-school security solution or use it for sensitive records.

For an internet-enabled or multi-user deployment, keep local AI and external-source connectors opt-in, restrict allowed domains, obtain parent/district approval before sharing student data, and use platform-level controls to prevent leaving the app.

### Local owner recovery

New homes begin with local Admin username `admin` and initial password `12341234`; the owner should change it after first sign-in. Existing homes can use **Recover local owner account** from the sign-in screen. The recovery secret is either the original owner password from setup or a legacy guardian PIN, and recovery then sets a new Admin password without removing local records.

There is deliberately no universal password that can reset every installation. If both recovery secrets are unavailable, the safe fallback is a local-data reset after a backup/export workflow is available.

### Public-release security roadmap

Before LearnOS is distributed beyond pre-release use, replace legacy recovery with a generated, high-entropy owner recovery kit; move credentials and records to encrypted storage; use a memory-hard password KDF; enforce role permissions in the data layer; add login throttling, audit events, signed backup/restore, and module signing/review. Public-school use also requires accessibility, privacy, retention, and district security review.
