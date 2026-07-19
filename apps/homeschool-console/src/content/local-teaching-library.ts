export interface LocalLesson {
  id: string
  subject: string
  ages: string
  title: string
  objective: string
  materials: string[]
  steps: string[]
  extension: string
}

const build = (subject: string, ages: string, entries: Array<[string, string, string]>) => entries.map(([title, objective, extension], index): LocalLesson => ({
  id: `${subject.toLowerCase().replaceAll(' ', '-')}-${index + 1}`,
  subject, ages, title, objective,
  materials: ['Paper or notebook', 'Pencil or crayons', 'A local household object'],
  steps: ['Begin with a wonder question.', 'Invite the child to observe, draw, sort, build, read, or explain.', 'Ask “What makes you think that?”', 'Save one sentence, sketch, photo, or voice note in the learning portfolio.'],
  extension,
}))

export const localTeachingLibrary: LocalLesson[] = [
  ...build('Art & Creativity', 'PreK–12', [
    ['Color Detective', 'Notice warm, cool, bright, and quiet colors in everyday objects.', 'Make a five-color family palette.'],
    ['Texture Rubbing Lab', 'Compare textures using safe household surfaces.', 'Create a texture map of one room.'],
    ['Museum Label Maker', 'Write an artwork title, material list, and interpretation.', 'Curate a three-piece home exhibition.'],
    ['Memory Collage', 'Use images and words to tell a true story.', 'Interview a family member about one image.'],
    ['Shadow Theatre', 'Explore silhouette, movement, and narrative.', 'Perform a two-minute original story.'],
    ['Design for Someone', 'Use empathy to create a useful object or sign.', 'Ask the recipient for feedback and revise.'],
  ]),
  ...build('History & Geography', 'K–12', [
    ['Object Time Capsule', 'Use objects as evidence about a moment in time.', 'Write a note to a future learner.'],
    ['Map My Day', 'Represent a familiar route using symbols and a key.', 'Add distance or time estimates.'],
    ['Then and Now', 'Compare a family or community photograph with today.', 'Identify continuity and change.'],
    ['Primary Source Detective', 'Separate observation, inference, and question.', 'Find a second source that confirms or complicates an idea.'],
    ['Community Helpers Oral History', 'Prepare respectful interview questions.', 'Create a captioned audio or written record with consent.'],
    ['Migration Stories', 'Explore why people move and how place shapes life.', 'Map a real or fictional journey.'],
  ]),
  ...build('Science', 'PreK–12', [
    ['Backyard Biodiversity Count', 'Observe and classify living things without disturbing them.', 'Graph observations over a week.'],
    ['Kitchen Chemistry', 'Describe changes in matter safely.', 'Design a fair comparison with one changed variable.'],
    ['Weather Station', 'Measure and record daily conditions.', 'Look for patterns across two weeks.'],
    ['Sound Map', 'Identify vibrations and sound sources.', 'Build a quiet/noisy zone map.'],
    ['Moon Journal', 'Track visible moon changes.', 'Create a prediction for next week.'],
    ['Engineering Repair Challenge', 'Test, revise, and explain a simple solution.', 'Document a failed prototype and what it taught you.'],
  ]),
  ...build('Language Arts', 'PreK–12', [
    ['Word Collector', 'Notice interesting words in local reading.', 'Sort words by feeling, sound, or meaning.'],
    ['Family Recipe Reading', 'Follow procedural text and sequence steps.', 'Rewrite the recipe for a new audience.'],
    ['Six-Word Story', 'Choose precise words to imply a story.', 'Illustrate the implied beginning and ending.'],
    ['Letter to the Future', 'Write with audience and purpose.', 'Seal it with a future open date.'],
    ['Poetry Sound Walk', 'Use sensory details and line breaks.', 'Perform the poem aloud.'],
    ['Fact, Claim, Question', 'Practice information literacy without browsing.', 'Use a trusted adult or book to verify one claim.'],
  ]),
  ...build('Mathematics', 'PreK–12', [
    ['Snack Fraction Studio', 'Model equal parts and fair shares.', 'Create a fraction recipe.'],
    ['Budget a Picnic', 'Use addition, subtraction, and decision-making.', 'Compare two budgets.'],
    ['Pattern Hunt', 'Identify, extend, and describe patterns.', 'Design a repeating tile pattern.'],
    ['Measurement Makers', 'Estimate and measure with standard or nonstandard units.', 'Build a scale drawing of a room.'],
    ['Data Story', 'Collect, graph, and interpret a small data set.', 'Write three claims supported by the graph.'],
    ['Math Game Inventor', 'Design rules that require target skills.', 'Play-test and improve the rules.'],
  ]),
  ...build('Music & Movement', 'PreK–12', [
    ['Found Sound Orchestra', 'Classify pitch, volume, and rhythm using safe objects.', 'Compose an eight-beat pattern.'],
    ['Movement Story', 'Represent story events using space and tempo.', 'Perform for a partner.'],
    ['Listening Map', 'Track repeated musical ideas with drawings.', 'Compare two pieces by mood and instrumentation.'],
    ['Beat Builder', 'Keep a steady beat and layer patterns.', 'Notate a pattern with invented symbols.'],
  ]),
]

export interface ClipArtToken { id: string; category: string; label: string; glyph: string; color: string }
const categories: Array<[string, string, string[]]> = [
  ['nature', '#2f9e44', ['🌿', '🌻', '🌈', '☀️', '🌙', '⭐', '🦋', '🐝', '🐢', '🐳', '🍄', '🌎']],
  ['school', '#4c6ef5', ['📚', '✏️', '🖍️', '📐', '🔍', '🧮', '🧪', '🔬', '🧠', '🎓', '📌', '🗂️']],
  ['history', '#c2410c', ['🏛️', '🗺️', '📜', '🧭', '🏺', '⏳', '🚂', '🪶', '🕯️', '🛶', '🗿', '🎞️']],
  ['art', '#9c36b5', ['🎨', '🖼️', '🎭', '🎵', '🥁', '🎹', '🧵', '✂️', '🪡', '🖌️', '📷', '🪩']],
  ['home', '#e64980', ['🏠', '🍎', '🥕', '🧺', '🔑', '🪴', '🫶', '👨‍👩‍👧', '🐾', '🚲', '🏕️', '🎁']],
]
export const localClipArtBank: ClipArtToken[] = categories.flatMap(([category, color, glyphs]) => glyphs.map((glyph, index) => ({ id: `${category}-${index + 1}`, category, label: `${category} clip art ${index + 1}`, glyph, color })))
