# K–12 semester module library

This directory is the curriculum library for the LearnOS module manager. It contains one declarative, grade-banded semester manifest for every core, hobby/enrichment, and world/society subject, grade, and semester. All 1,638 manifests (13 grades × 63 subjects × 2 semesters) have completed goals, four units, twelve lessons, evidence options, and learner-facing success criteria.

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
- **Versions:** `1.0.0` identifies the current complete local curriculum pathway; advance deliberately when its scope or content changes.

Each manifest is compatible with the existing module importer. Review and adapt pacing, resources, accessibility supports, local/state requirements, safety requirements, and learner needs before assigning it. The pathways are framework-informed planning material, not a replacement for educator judgment or locally adopted curriculum. Copy [the semester template](templates/semester-module.template.json) when introducing a new grade, subject, or term.

For a standards-first path to source, license, and map each unit, see [the course-material retrieval system](_system/COURSE_MATERIAL_RETRIEVAL.md). For the learner, evidence, review, and teacher-attention workflow, see [the module interaction scaffold](_system/MODULE_INTERACTION_SCAFFOLD.md).

Run `node scripts/scaffold-k12-modules.mjs --check` to confirm the expected 1,638-manifest coverage. See [the K–12 citation log](../../../../../../../docs/K12_LIBRARY_CITATION_LOG.md) for the framework sources used to shape grade-banded pathways.
