# Module interaction scaffold

Each K–12 manifest remains a **semester-scoped module**. It follows this path:

```text
Grade → subject → semester module → unit → lesson → activity → evidence/review
```

## Design center: STEM × fine and modern art × technology

The program’s core is not a set of isolated subject tracks. Each released unit should deliberately connect a scientific, mathematical, or engineering idea with fine-art or modern-art practice and an appropriate technology or media tool. The unit’s essential question, learner action, and evidence should make that bridge visible—for example: model and visualize data; prototype an interactive artwork; study light, color, materials, and perception; or communicate a scientific claim through digital media.

## Required authoring fields before release

- **Unit:** an essential question, measurable outcomes, standards IDs, lessons, and an explicit STEM × art × technology connection.
- **Lesson:** objective, estimated minutes, optional prerequisites, activities, and success criteria.
- **Activity:** learner action, one of `learn | practice | create | discuss | reflect | assess`, evidence choices, and estimated minutes.
- **Pacing:** intended weeks plus `flexible: true`; a learner can pause, repeat, or use an approved alternative.

## Learner and teacher workflow

```text
not-started → in-progress → ready-for-review → complete
                                  └──────────→ needs-revision → in-progress
```

- Learners submit evidence, which changes the lesson to `ready-for-review`.
- Learners can raise a hand from any lesson for directions, materials, understanding, feedback, or another reason.
- Teachers review evidence, leave feedback, set mastery (`emerging` through `extending`), and either complete or return the lesson for revision.
- Teacher reporting is derived from the attention queue: open raised hands plus lessons ready for review.

## Guardrails

A module is still a draft until its `TODO` fields are replaced, its material records are approved, and its standards/evidence mapping has been reviewed. Completion and mastery are deliberately distinct: participation alone does not claim mastery.
