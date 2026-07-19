# K–12 semester module library

This directory is the curriculum-planning scaffold for the LearnOS module manager. It contains one declarative module manifest for every enabled learner subject, grade, and semester:

```text
{grade-slug}/{subject-slug}/{grade-slug}-{subject-slug}-{semester-slug}.module.json
```

Examples:

```text
kindergarten/mathematics/kindergarten-mathematics-semester-01.module.json
grade-01/language-arts/grade-01-language-arts-semester-01.module.json
grade-01/language-arts/grade-01-language-arts-semester-02.module.json
grade-12/engineering/grade-12-engineering-semester-02.module.json
```

## Naming convention

- **Grade folders:** `kindergarten`, then zero-padded `grade-01` through `grade-12`.
- **Subject folders:** lowercase kebab case, matching the existing module subject name.
- **Semester files:** `{grade}-{subject}-semester-01.module.json` and `{grade}-{subject}-semester-02.module.json`.
- **Module IDs:** match the filename without `.module.json`.
- **Versions:** begin at `0.1.0` while a module is a draft; advance deliberately when its scope or content is released.

Each manifest is compatible with the existing module importer. Before assigning one to a learner, replace every `TODO` goal and lesson, add age-appropriate resources, and revise its description/version. Copy [the semester template](templates/semester-module.template.json) when introducing a new grade, subject, or term.

For a standards-first path to source, license, and map each unit, see [the course-material retrieval system](_system/COURSE_MATERIAL_RETRIEVAL.md). For the learner, evidence, review, and teacher-attention workflow, see [the module interaction scaffold](_system/MODULE_INTERACTION_SCAFFOLD.md).

The scaffold is generated from `scripts/scaffold-k12-modules.mjs`.  Run it after intentionally changing the supported-subject list, then run `node scripts/scaffold-k12-modules.mjs --check` to confirm the expected coverage.
