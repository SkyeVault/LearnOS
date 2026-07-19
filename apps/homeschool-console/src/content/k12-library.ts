/**
 * Curated K–12 discovery catalog. This data is intentionally link-first:
 * downloaded books, PDFs, images, and simulations need an individual review
 * record in docs/CITATION_LOG.md before they are bundled with the app.
 */
export type AccessMode = 'open-review-required' | 'free-link-only'

export interface K12Course {
  id: string
  subject: string
  gradeBand: string
  title: string
  description: string
  units: string[]
  resources: Array<{ provider: string; title: string; url: string; access: AccessMode }>
}

const ck12 = { provider: 'CK-12', title: 'FlexBooks and adaptive practice', url: 'https://www.ck12.org/student/', access: 'open-review-required' as const }
const coreKnowledge = { provider: 'Core Knowledge Foundation', title: 'Free curriculum downloads', url: 'https://www.coreknowledge.org/download-free-curriculum/', access: 'open-review-required' as const }
const openstax = { provider: 'OpenStax', title: 'Open textbook subjects', url: 'https://openstax.org/subjects', access: 'open-review-required' as const }
const codeorg = { provider: 'Code.org', title: 'Computer science curriculum', url: 'https://code.org/educate/curriculum', access: 'open-review-required' as const }
const phet = { provider: 'PhET', title: 'Interactive simulations', url: 'https://phet.colorado.edu/', access: 'free-link-only' as const }
const loc = { provider: 'Library of Congress', title: 'Classroom materials', url: 'https://www.loc.gov/programs/teachers/classroom-materials/', access: 'free-link-only' as const }
const openTextbookLibrary = { provider: 'Open Textbook Library', title: 'Search 1,760+ open textbooks', url: 'https://open.umn.edu/opentextbooks/', access: 'open-review-required' as const }
const wikibooks = { provider: 'Wikibooks', title: 'Open textbooks', url: 'https://en.wikibooks.org/wiki/Category:Textbooks', access: 'open-review-required' as const }

export const k12Library: K12Course[] = [
  {
    id: 'ela-prek-2', subject: 'Language Arts', gradeBand: 'PreK–2', title: 'Read, speak, and tell stories',
    description: 'Foundational literacy, vocabulary, handwriting, listening, and joyful reading.',
    units: ['Print awareness', 'Phonological awareness', 'Alphabet knowledge', 'Phonics', 'High-frequency words', 'Read-aloud comprehension', 'Vocabulary', 'Sentence building', 'Personal narrative', 'Poetry and rhyme', 'Speaking and listening', 'Library habits'],
    resources: [coreKnowledge, wikibooks],
  },
  {
    id: 'ela-3-5', subject: 'Language Arts', gradeBand: '3–5', title: 'Reading, writing, and research',
    description: 'Comprehension strategies, informational reading, grammar, and guided research.',
    units: ['Reading stamina', 'Main idea and evidence', 'Narrative craft', 'Opinion writing', 'Informative writing', 'Paragraph structure', 'Grammar and usage', 'Word study', 'Poetry', 'Drama', 'Research questions', 'Source evaluation'],
    resources: [coreKnowledge, loc, wikibooks],
  },
  {
    id: 'ela-6-12', subject: 'Language Arts', gradeBand: '6–8', title: 'Literature, argument, and media literacy',
    description: 'Close reading and writing foundations for secondary study.',
    units: ['Theme and character', 'Narrative point of view', 'Argument and counterclaim', 'Evidence and citation', 'Rhetoric', 'Grammar in context', 'Literary analysis', 'Research writing', 'Media literacy', 'Speech and debate', 'Poetry', 'Revision workshop'],
    resources: [openTextbookLibrary, loc, wikibooks],
  },
  {
    id: 'math-prek-2', subject: 'Mathematics', gradeBand: 'PreK–2', title: 'Number sense and early problem solving',
    description: 'Counting, operations, shapes, measurement, and math talk.',
    units: ['Counting and cardinality', 'Comparing quantities', 'Addition stories', 'Subtraction stories', 'Place value beginnings', 'Patterns', 'Shapes', 'Measurement', 'Time', 'Money', 'Data pictures', 'Mathematical explanations'],
    resources: [coreKnowledge, ck12, phet],
  },
  {
    id: 'math-3-5', subject: 'Mathematics', gradeBand: '3–5', title: 'Operations, fractions, and models',
    description: 'Fluency plus visual models and real-world problem solving.',
    units: ['Multiplication', 'Division', 'Place value', 'Multi-digit arithmetic', 'Fractions', 'Decimals', 'Measurement', 'Geometry', 'Area and volume', 'Data', 'Coordinate plane', 'Problem-solving strategies'],
    resources: [coreKnowledge, ck12, phet],
  },
  {
    id: 'math-6-8', subject: 'Mathematics', gradeBand: '6–8', title: 'Pre-algebra and mathematical modeling',
    description: 'Ratios, expressions, equations, geometry, statistics, and algebraic reasoning.',
    units: ['Ratios and rates', 'Number systems', 'Expressions', 'Equations', 'Inequalities', 'Functions', 'Proportional reasoning', 'Geometry', 'Statistics', 'Probability', 'Data displays', 'Modeling'],
    resources: [coreKnowledge, ck12, openstax, phet],
  },
  {
    id: 'math-9-12', subject: 'Mathematics', gradeBand: '9–12', title: 'Algebra through calculus and data science',
    description: 'A flexible secondary sequence for college and career preparation.',
    units: ['Algebra 1', 'Geometry', 'Algebra 2', 'Trigonometry', 'Precalculus', 'Statistics', 'Financial mathematics', 'Discrete mathematics', 'Calculus limits', 'Derivatives', 'Integrals', 'Data science'],
    resources: [ck12, openstax, openTextbookLibrary, phet],
  },
  {
    id: 'science-prek-5', subject: 'Science', gradeBand: 'PreK–2', title: 'Observe, wonder, investigate',
    description: 'Hands-on life, earth, physical, and space science.',
    units: ['Asking questions', 'Living things', 'Plants', 'Animal habitats', 'Weather', 'Water', 'Light and shadow', 'Sound', 'Forces and motion', 'Materials', 'Sky patterns', 'Design challenges'],
    resources: [coreKnowledge, ck12, phet],
  },
  {
    id: 'science-3-5', subject: 'Science', gradeBand: '3–5', title: 'Systems and scientific explanation',
    description: 'Matter, ecosystems, energy, earth systems, and engineering.',
    units: ['Scientific methods', 'Matter', 'Energy', 'Forces', 'Ecosystems', 'Inheritance', 'Earth materials', 'Weather and climate', 'Solar system', 'Data and graphs', 'Engineering design', 'Science communication'],
    resources: [coreKnowledge, ck12, phet, openstax],
  },
  {
    id: 'science-6-8', subject: 'Science', gradeBand: '6–8', title: 'Integrated middle-school science',
    description: 'Life, physical, earth-space science, labs, and models.',
    units: ['Cells', 'Body systems', 'Ecology', 'Chemistry of matter', 'Reactions', 'Forces and energy', 'Waves', 'Earth systems', 'Geologic time', 'Weather and climate', 'Space systems', 'Engineering'],
    resources: [ck12, phet, openstax, openTextbookLibrary],
  },
  {
    id: 'science-9-12', subject: 'Science', gradeBand: '9–12', title: 'Laboratory science sequence',
    description: 'Biology, chemistry, physics, environmental science, and advanced electives.',
    units: ['Biology', 'Chemistry', 'Physics', 'Earth science', 'Environmental science', 'Anatomy and physiology', 'Astronomy', 'Microbiology', 'Organic chemistry', 'Data analysis', 'Lab design', 'Research ethics'],
    resources: [ck12, openstax, openTextbookLibrary, phet],
  },
  {
    id: 'history-geography', subject: 'History & Geography', gradeBand: '3–5', title: 'Communities, regions, and the past',
    description: 'Maps, cultures, civic life, and evidence-based history.',
    units: ['Community', 'Maps and globes', 'Landforms', 'Native nations', 'Early civilizations', 'Colonial America', 'Revolution', 'Westward expansion', 'Immigration', 'World regions', 'Economics', 'Historical sources'],
    resources: [coreKnowledge, loc, wikibooks],
  },
  {
    id: 'history-geography-secondary', subject: 'History & Geography', gradeBand: '6–8', title: 'World history, U.S. history, and geography',
    description: 'Chronology, historical argument, human geography, and primary sources.',
    units: ['Historical thinking', 'Ancient world', 'Medieval world', 'Global exchange', 'Revolutions', 'U.S. founding', 'Civil War and Reconstruction', 'Industrialization', 'World wars', 'Civil rights', 'Contemporary world', 'Human geography'],
    resources: [coreKnowledge, loc, openstax, wikibooks],
  },
  {
    id: 'civics-economics', subject: 'Civics & Economics', gradeBand: '9–12', title: 'Citizenship, institutions, and personal economics',
    description: 'Government, law, media literacy, markets, and financial decision-making.',
    units: ['Constitution', 'Federalism', 'Civil liberties', 'Elections', 'Courts', 'Public policy', 'Microeconomics', 'Macroeconomics', 'Personal budgeting', 'Credit', 'Taxes', 'Media and civic participation'],
    resources: [loc, openstax, openTextbookLibrary],
  },
  {
    id: 'computing', subject: 'Computer Science', gradeBand: 'PreK–2', title: 'Computational thinking and creativity',
    description: 'Sequencing, patterns, digital citizenship, and creative computing.',
    units: ['Algorithms unplugged', 'Sequences', 'Events', 'Loops', 'Debugging', 'Digital citizenship', 'Creative stories', 'Data patterns', 'Networks', 'Design process', 'Collaboration', 'Showcase'],
    resources: [codeorg],
  },
  {
    id: 'computing-secondary', subject: 'Computer Science', gradeBand: '6–12', title: 'Programming, data, and computing systems',
    description: 'A multi-year pathway from block coding to Python, web development, and data science.',
    units: ['Programming foundations', 'Web development', 'Python', 'Data and visualization', 'Algorithms', 'Cybersecurity', 'Networks', 'Artificial intelligence literacy', 'Physical computing', 'Software engineering', 'Digital ethics', 'Capstone'],
    resources: [codeorg, openstax, openTextbookLibrary, wikibooks],
  },
  {
    id: 'arts-music', subject: 'Visual Art & Music', gradeBand: 'PreK–5', title: 'Create, perform, and respond',
    description: 'Visual literacy, making, rhythm, melody, movement, and arts reflection.',
    units: ['Elements of art', 'Color', 'Line and shape', 'Texture', 'Collage', 'Drawing', 'Rhythm', 'Beat', 'Melody', 'Instrument families', 'Movement', 'Artist and performer reflection'],
    resources: [coreKnowledge, wikibooks],
  },
  {
    id: 'languages', subject: 'World Languages', gradeBand: '3–12', title: 'Communication and culture',
    description: 'A language-agnostic pathway adaptable to Spanish, ASL, French, or a heritage language.',
    units: ['Greetings', 'Sound system', 'High-frequency vocabulary', 'Listening', 'Conversation', 'Reading', 'Writing', 'Food and family', 'Places and travel', 'Stories', 'Culture comparison', 'Presentation'],
    resources: [wikibooks, openTextbookLibrary],
  },
  {
    id: 'health-pe', subject: 'Health & Physical Education', gradeBand: 'PreK–12', title: 'Wellbeing, movement, and lifelong fitness',
    description: 'Age-appropriate movement, nutrition, safety, mental wellbeing, and health literacy.',
    units: ['Movement skills', 'Fitness', 'Nutrition', 'Sleep', 'Emotions', 'Relationships', 'Personal safety', 'First aid awareness', 'Media and health', 'Teamwork', 'Goal setting', 'Outdoor learning'],
    resources: [openTextbookLibrary, wikibooks],
  },
  {
    id: 'engineering-life', subject: 'Engineering & Life Skills', gradeBand: '3–12', title: 'Design, making, and independent living',
    description: 'Practical projects joining engineering, home skills, sustainability, and personal responsibility.',
    units: ['Design cycle', 'Simple machines', 'Structures', 'Circuits', 'CAD concepts', 'Fabrication', 'Gardening', 'Food planning', 'Cooking safety', 'Money management', 'Time management', 'Portfolio capstone'],
    resources: [openstax, openTextbookLibrary, wikibooks],
  },
]
