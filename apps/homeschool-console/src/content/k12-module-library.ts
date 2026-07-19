export type K12Grade = 'kindergarten' | `grade-${string}`

export const k12Grades: Array<{ id: K12Grade; label: string; shortLabel: string }> = [
  { id: 'kindergarten', label: 'Kindergarten', shortLabel: 'K' },
  ...Array.from({ length: 12 }, (_, index) => {
    const grade = index + 1
    return { id: `grade-${String(grade).padStart(2, '0')}` as K12Grade, label: `Grade ${grade}`, shortLabel: String(grade) }
  }),
]

export type K12ModuleSubject = {
  id: string
  name: string
  icon: string
  color: string
  framework: string
  frameworkUrl?: string
  summary: string
  semesters: [string, string]
}

// The visual shelf is a local index of the K–12 manifest scaffold. It deliberately
// presents standards and retrieval paths without automatically opening the web.
export const k12ModuleSubjects: K12ModuleSubject[] = [
  { id: 'early-learning', name: 'Early Learning', icon: '🌱', color: '#3e8b6c', framework: 'Head Start ELOF + local K standards', frameworkUrl: 'https://headstart.gov/school-readiness/effective-practice-guides/effective-practice-guides', summary: 'Playful readiness, language, number, movement, and belonging.', semesters: ['Roots & routines', 'Stories & growing independence'] },
  { id: 'music', name: 'Music', icon: '🎵', color: '#8d4db5', framework: 'National Core Arts Standards', frameworkUrl: 'https://www.nationalartsstandards.org/content/national-core-arts-standards', summary: 'Create, perform, respond, and connect through sound.', semesters: ['Listen, sing & make', 'Perform, compose & connect'] },
  { id: 'beginner-coding', name: 'Beginner Coding', icon: '💻', color: '#326cc3', framework: 'CSTA + ISTE Students', frameworkUrl: 'https://csteachers.org/k12standards/', summary: 'Computational thinking, code, design, and digital citizenship.', semesters: ['Patterns & instructions', 'Projects & problem solving'] },
  { id: 'mathematics', name: 'Mathematics', icon: '➗', color: '#197a92', framework: 'Common Core Mathematics', frameworkUrl: 'https://corestandards.org/mathematics-standards/', summary: 'Coherent concepts, procedures, reasoning, and real-world problems.', semesters: ['Build understanding', 'Apply, explain & extend'] },
  { id: 'reading', name: 'Reading', icon: '📚', color: '#b15b34', framework: 'Common Core ELA/Literacy', frameworkUrl: 'https://corestandards.org/english-language-arts-standards/', summary: 'Read closely, build knowledge, and respond to meaningful texts.', semesters: ['Stories & meaning', 'Knowledge & craft'] },
  { id: 'science', name: 'Science', icon: '🔬', color: '#287355', framework: 'Next Generation Science Standards', frameworkUrl: 'https://www.nextgenscience.org/standards', summary: 'Three-dimensional inquiry through phenomena, evidence, and design.', semesters: ['Wonder, investigate & model', 'Explain, design & communicate'] },
  { id: 'history', name: 'History', icon: '🏛️', color: '#77524b', framework: 'C3 Framework + state standards', frameworkUrl: 'https://www.socialstudies.org/standards/c3', summary: 'Questions, evidence, perspective, and historical argument.', semesters: ['People, sources & change', 'Evidence, claims & civic stories'] },
  { id: 'geography', name: 'Geography', icon: '🗺️', color: '#26826b', framework: 'C3 Geography Dimension + state standards', frameworkUrl: 'https://www.socialstudies.org/standards/c3', summary: 'Place, maps, systems, and human-environment connections.', semesters: ['Where we are', 'Places, systems & connections'] },
  { id: 'language-arts', name: 'Language Arts', icon: '✍️', color: '#c05a7e', framework: 'Common Core ELA/Literacy', frameworkUrl: 'https://corestandards.org/english-language-arts-standards/', summary: 'Reading, writing, speaking, listening, and language as one practice.', semesters: ['Read, write & share', 'Research, revise & publish'] },
  { id: 'art-and-creativity', name: 'Art & Creativity', icon: '🎨', color: '#b2517d', framework: 'National Core Arts Standards', frameworkUrl: 'https://www.nationalartsstandards.org/content/national-core-arts-standards', summary: 'Create, present, respond, and connect across visual and media arts.', semesters: ['Explore materials & ideas', 'Create, present & reflect'] },
  { id: 'physical-education', name: 'Physical Education', icon: '⚽', color: '#ce7d22', framework: 'SHAPE America National PE Standards', frameworkUrl: 'https://apeas.shapeamerica.org/APEAS3/standards/pe/new-pe-standards.aspx', summary: 'Physical literacy, movement confidence, health, and lifelong activity.', semesters: ['Move with confidence', 'Play, care & persist'] },
  { id: 'engineering', name: 'Engineering', icon: '🛠️', color: '#52708e', framework: 'NGSS Engineering Design', frameworkUrl: 'https://www.nextgenscience.org/resources/appendix-i-engineering-design-ngss', summary: 'Define problems, test ideas, and improve solutions.', semesters: ['Ask, imagine & prototype', 'Test, improve & explain'] },
  { id: 'living-library', name: 'Living Library', icon: '🔎', color: '#254a49', framework: 'AASL National School Library Standards', frameworkUrl: 'https://standards.aasl.org/framework/', summary: 'Inquiry, inclusion, curation, exploration, and ethical engagement.', semesters: ['Question & curate', 'Create, share & reflect'] },
  { id: 'homestead-lab', name: 'Homestead Lab', icon: '🏠', color: '#8a653e', framework: 'Family & Consumer Sciences + safety guidance', frameworkUrl: 'https://www.nasafacs.org/national-standards-overview.html', summary: 'Safe real-life routines, care, food, home, and responsibility.', semesters: ['Care for home & self', 'Plan, prepare & contribute'] },
  { id: 'learning-commons', name: 'Learning Commons', icon: '🤝', color: '#5661a8', framework: 'AASL + ISTE Students', frameworkUrl: 'https://standards.aasl.org/framework/', summary: 'Research, collaboration, media literacy, and learning strategies.', semesters: ['Ask, find & evaluate', 'Make, share & improve'] },
  { id: 'gardening', name: 'Gardening', icon: '🌻', color: '#54833c', framework: 'NAAEE + NGSS', frameworkUrl: 'https://naaee.org/eepro/resources/guidelines-excellence', summary: 'Seasonal observation, living systems, stewardship, and food.', semesters: ['Observe & plan', 'Grow, tend & reflect'] },
  { id: 'mindful-movement', name: 'Mindful Movement', icon: '🧘', color: '#6e6bb3', framework: 'CASEL + SHAPE (supporting guides)', frameworkUrl: 'https://casel.org/fundamentals-of-sel/', summary: 'Optional, non-clinical movement, awareness, regulation, and care.', semesters: ['Notice body & breath', 'Move, reset & care'] },
  { id: 'spirit', name: 'Spirit', icon: '✨', color: '#9b6a31', framework: 'Family-directed scope and sequence', summary: 'Optional family-guided reflection, traditions, ethics, and meaning.', semesters: ['Wonder & belonging', 'Practice & reflection'] },
]

export type UnitBlueprint = { id: string; title: string; essentialQuestion: string; lessonFocus: string }

export function unitBlueprintFor(grade: K12Grade, subject: K12ModuleSubject, semester: 1 | 2): UnitBlueprint[] {
  const semesterTitle = subject.semesters[semester - 1]
  const gradeLabel = k12Grades.find(item => item.id === grade)?.label ?? "This grade"
  return [
    { id: "u01", title: "Launch: " + semesterTitle, essentialQuestion: "What does " + gradeLabel + " " + subject.name + " invite us to notice and wonder?", lessonFocus: "Notice, name prior knowledge, and set a meaningful question." },
    { id: "u02", title: "Explore & practice", essentialQuestion: "How do we build skill and understanding in " + subject.name + "?", lessonFocus: "Learn through models, guided practice, and feedback." },
    { id: "u03", title: "Create & apply", essentialQuestion: "How can we use " + subject.name + " to make, solve, or contribute?", lessonFocus: "Apply learning in a STEM, fine-art, or real-world creation." },
    { id: "u04", title: "Reflect & share", essentialQuestion: "What evidence shows growth, and what should happen next?", lessonFocus: "Share evidence, reflect, request help when needed, and set a next step." },
  ]
}

export function moduleIdFor(grade: K12Grade, subjectId: string, semester: 1 | 2) {
  return `${grade}-${subjectId}-semester-${String(semester).padStart(2, '0')}`
}
