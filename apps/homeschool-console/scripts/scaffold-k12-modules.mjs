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
const coreSubjects = [
  ['early-learning', 'Early Learning'], ['music', 'Music'], ['beginner-coding', 'Beginner Coding'], ['mathematics', 'Mathematics'], ['reading', 'Reading'], ['science', 'Science'], ['history', 'History'], ['geography', 'Geography'], ['language-arts', 'Language Arts'], ['art-and-creativity', 'Art & Creativity'], ['physical-education', 'Physical Education'], ['engineering', 'Engineering'], ['living-library', 'Living Library'], ['homestead-lab', 'Homestead Lab'], ['learning-commons', 'Learning Commons'], ['gardening', 'Gardening'], ['mindful-movement', 'Mindful Movement'], ['spirit', 'Spirit'],
]
const semesters = [['semester-01', 'Semester 1'], ['semester-02', 'Semester 2']]
const hobbySubjects = [
  ['fiber-arts', 'Fiber Arts'], ['drawing-and-illustration', 'Drawing & Illustration'], ['painting-and-mixed-media', 'Painting & Mixed Media'], ['ceramics-and-sculpture', 'Ceramics & Sculpture'], ['photography-and-film', 'Photography & Film'], ['digital-art-and-design', 'Digital Art & Design'], ['woodworking', 'Woodworking'], ['metalwork-and-jewelry', 'Metalwork & Jewelry'], ['fashion-and-textile-design', 'Fashion & Textile Design'], ['robotics-and-electronics', 'Robotics & Electronics'], ['maker-and-3d-design', 'Maker & 3D Design'], ['culinary-arts-and-baking', 'Culinary Arts & Baking'], ['nutrition-and-food-science', 'Nutrition & Food Science'], ['healthy-cooking', 'Healthy Cooking'], ['home-economics-and-life-skills', 'Home Economics & Life Skills'], ['recipe-studio-and-food-culture', 'Recipe Studio & Food Culture'], ['animal-care', 'Animal Care & Horsemanship'], ['outdoor-adventure', 'Outdoor Adventure'], ['fishing-and-water-skills', 'Fishing & Water Skills'], ['archery-and-target-sports', 'Archery & Target Sports'], ['gymnastics-and-dance', 'Gymnastics & Dance'], ['team-sports', 'Team Sports'], ['individual-sports-and-fitness', 'Individual Sports & Fitness'], ['martial-arts', 'Martial Arts'], ['skateboarding-and-cycling', 'Skateboarding & Cycling'], ['chess-and-strategy-games', 'Chess & Strategy Games'], ['tabletop-game-design', 'Tabletop Game Design'], ['model-building-and-miniatures', 'Model Building & Miniatures'], ['theater-and-improv', 'Theater & Improv'], ['debate-and-public-speaking', 'Debate & Public Speaking'], ['languages-and-culture', 'Languages & Culture'], ['financial-literacy-and-entrepreneurship', 'Financial Literacy & Entrepreneurship'], ['automotive-and-mechanics', 'Automotive & Mechanics'], ['home-repair-and-diy', 'Home Repair & DIY'], ['aviation-and-flight', 'Aviation & Flight'],
]
const baseSubjects = [...coreSubjects, ...hobbySubjects]

const explorationSubjects = [
  ['world-religions-and-belief', 'World Religions & Belief'], ['world-politics-and-global-affairs', 'World Politics & Global Affairs'], ['travel-and-global-citizenship', 'Travel & Global Citizenship'], ['antiques-and-material-culture', 'Antiques & Material Culture'], ['coins-and-collectibles', 'Coins & Collectibles'], ['archaeology-and-museum-studies', 'Archaeology & Museum Studies'], ['journalism-and-media-studies', 'Journalism & Media Studies'], ['environmental-stewardship', 'Environmental Stewardship'], ['anatomy-and-physiology', 'Anatomy & Physiology'], ['exercise-science', 'Exercise Science'],
]
const subjects = [...coreSubjects, ...hobbySubjects, ...explorationSubjects]
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
