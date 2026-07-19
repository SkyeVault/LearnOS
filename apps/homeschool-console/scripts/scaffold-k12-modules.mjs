import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const curriculumRoot = join(scriptDirectory, '..', 'src', 'content', 'curriculum', 'k-12')
const grades = [['kindergarten', 'Kindergarten', 'K'], ...Array.from({ length: 12 }, (_, index) => {
  const grade = index + 1
  return [`grade-${String(grade).padStart(2, '0')}`, `Grade ${grade}`, String(grade)]
})]
// Keep this list aligned with moduleSubjectOptions in src/features/modules.ts.
const subjects = [
  ['early-learning', 'Early Learning'], ['music', 'Music'], ['beginner-coding', 'Beginner Coding'], ['mathematics', 'Mathematics'], ['reading', 'Reading'], ['science', 'Science'], ['history', 'History'], ['geography', 'Geography'], ['language-arts', 'Language Arts'], ['art-and-creativity', 'Art & Creativity'], ['physical-education', 'Physical Education'], ['engineering', 'Engineering'], ['living-library', 'Living Library'], ['homestead-lab', 'Homestead Lab'], ['learning-commons', 'Learning Commons'], ['gardening', 'Gardening'], ['mindful-movement', 'Mindful Movement'], ['spirit', 'Spirit'],
]
const semesters = [['semester-01', 'Semester 1'], ['semester-02', 'Semester 2']]

function unitRoadmap({ subjectName, gradeName, semesterName }) {
  const phases = [
    ["Launch: " + semesterName, "Notice, name prior knowledge, and set a meaningful question."],
    ["Explore & practice", "Learn through models, guided practice, and feedback."],
    ["Create & apply", "Apply learning in a STEM, fine-art, or real-world creation."],
    ["Reflect & share", "Share evidence, reflect, request help when needed, and set a next step."],
  ]
  return phases.map(([title, focus], index) => {
    const unitId = "u" + String(index + 1).padStart(2, "0")
    return {
      id: unitId, title, essentialQuestion: "How can " + gradeName + " learners use " + subjectName + " to notice, understand, and contribute?",
      outcomes: [focus], standardIds: ["TODO: Add state and national standard IDs."],
      lessons: Array.from({ length: 3 }, (_, lessonIndex) => ({
        id: unitId + "-l" + String(lessonIndex + 1).padStart(2, "0"), title: focus,
        objective: "TODO: Write a measurable " + subjectName + " objective for this lesson.", estimatedMinutes: 45, prerequisites: [],
        activities: [{ id: unitId + "-l" + String(lessonIndex + 1).padStart(2, "0") + "-a01", title: "Learner action", kind: lessonIndex === 2 ? "create" : "practice", learnerAction: focus, evidenceOptions: ["written-response", "observation"], estimatedMinutes: 30 }],
        successCriteria: ["TODO: Describe what success looks like."],
      })),
    }
  })
}

function manifest({ gradeSlug, gradeName, gradeCode, subjectSlug, subjectName, semesterSlug, semesterName }) {
  const id = `${gradeSlug}-${subjectSlug}-${semesterSlug}`
  return {
    id,
    name: `${gradeName} ${subjectName} — ${semesterName}`,
    description: `Planning template for ${gradeName} ${subjectName}, ${semesterName}. Replace the placeholder goals and lessons before assigning this module.`,
    version: '0.1.0',
    subjectNames: [subjectName],
    learningGoals: [`TODO: Define the first ${subjectName} outcome for ${gradeName}.`, `TODO: Define the evidence of learning for ${semesterName}.`],
    lessons: [{ title: 'TODO: Name the opening lesson', objective: `TODO: Write a measurable ${subjectName} objective for grade ${gradeCode}.`, minutes: 45 }],
    resources: [],
    curriculum: {
      gradeId: gradeSlug,
      subjectId: subjectSlug,
      semester: Number(semesterSlug.slice(-2)),
      pacing: { intendedWeeks: 18, flexible: true },
      units: unitRoadmap({ subjectName, gradeName, semesterName }),
    },
  }
}

async function main() {
  if (process.argv.includes('--check')) {
    const files = await readdir(curriculumRoot, { recursive: true })
    const manifests = files.filter(file => file.endsWith('.module.json'))
    const expected = grades.length * subjects.length * semesters.length
    if (manifests.length !== expected) throw new Error(`Expected ${expected} module manifests; found ${manifests.length}.`)
    console.log(`K–12 curriculum scaffold verified: ${manifests.length} semester manifests.`)
    return
  }
  for (const [gradeSlug, gradeName, gradeCode] of grades) {
    for (const [subjectSlug, subjectName] of subjects) {
      for (const [semesterSlug, semesterName] of semesters) {
        const file = join(curriculumRoot, gradeSlug, subjectSlug, `${gradeSlug}-${subjectSlug}-${semesterSlug}.module.json`)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, `${JSON.stringify(manifest({ gradeSlug, gradeName, gradeCode, subjectSlug, subjectName, semesterSlug, semesterName }), null, 2)}\n`)
      }
    }
  }
  const templateDirectory = join(curriculumRoot, 'templates')
  await rm(templateDirectory, { recursive: true, force: true })
  await mkdir(templateDirectory, { recursive: true })
  await writeFile(join(templateDirectory, 'semester-module.template.json'), `${JSON.stringify(manifest({ gradeSlug: 'grade-00', gradeName: 'Grade [00]', gradeCode: '[00]', subjectSlug: '[subject-slug]', subjectName: '[Subject Name]', semesterSlug: 'semester-01', semesterName: 'Semester [1]' }), null, 2)}\n`)
}
main()
