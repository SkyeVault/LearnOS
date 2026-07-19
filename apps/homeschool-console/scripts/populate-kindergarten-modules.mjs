import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', 'src', 'content', 'curriculum', 'k-12', 'kindergarten')

// These pathways use short, concrete experiences appropriate for five- and six-year-olds.
// Adult support is required for tools, heat, food preparation, water, traffic, animals, and online media.
const p = (name, s1, s2, framework, standard, url) => ({ name, s1, s2, framework, standard, url })
const subjects = {
  'early-learning': p('Early Learning', 'belonging, routines, play choices, and listening', 'stories, independence, feelings, and helpfulness', 'Head Start Early Learning Outcomes Framework', 'ELOF: Approaches to Learning', 'https://headstart.gov/school-readiness/effective-practice-guides/effective-practice-guides'),
  music: p('Music', 'steady beat, singing voice, loud/soft, and listening', 'rhythm patterns, musical stories, and sharing a performance', 'National Core Arts Standards', 'MU:Cr1.Ka', 'https://www.nationalartsstandards.org/'),
  'beginner-coding': p('Beginner Coding', 'sequencing, patterns, and giving precise unplugged directions', 'debugging, loops, and making a simple interactive story', 'CSTA K–12 Computer Science Standards', 'CSTA: 1A-AP-10', 'https://csteachers.org/k12standards/'),
  mathematics: p('Mathematics', 'counting, comparing, and representing numbers to 10', 'adding and taking apart within 10, shapes, and describing positions', 'Common Core State Standards for Mathematics', 'CCSS.MATH.CONTENT.K.CC.A.1', 'https://corestandards.org/mathematics-standards/'),
  reading: p('Reading', 'print awareness, phonological play, alphabet knowledge, and story meaning', 'decoding simple words, informational texts, and responding with evidence', 'Common Core State Standards for ELA', 'CCSS.ELA-LITERACY.RL.K.1', 'https://corestandards.org/ela-literacy/'),
  science: p('Science', 'weather, plants, animals, materials, and careful observation', 'pushes and pulls, light, habitats, and designing a solution', 'Next Generation Science Standards', 'NGSS.K-ESS2-1', 'https://www.nextgenscience.org/'),
  history: p('History', 'family stories, then-and-now, and objects as clues', 'community helpers, celebrations, and how places change', 'C3 Framework for Social Studies', 'C3: D2.His.2.K-2', 'https://www.socialstudies.org/standards/c3'),
  geography: p('Geography', 'home, classroom maps, land and water, and directional words', 'neighborhood places, weather, cultures, and caring for places', 'C3 Framework for Social Studies', 'C3: D2.Geo.1.K-2', 'https://www.socialstudies.org/standards/c3'),
  'language-arts': p('Language Arts', 'speaking, listening, drawing, dictating, and early writing', 'opinion, information, and narrative sharing with revision', 'Common Core State Standards for ELA', 'CCSS.ELA-LITERACY.W.K.2', 'https://corestandards.org/ela-literacy/'),
  'art-and-creativity': p('Art & Creativity', 'lines, shapes, colors, materials, and creative choices', 'artistic stories, presentation, and kind reflection', 'National Core Arts Standards', 'VA:Cr1.1.Ka', 'https://www.nationalartsstandards.org/'),
  'physical-education': p('Physical Education', 'safe space, locomotor skills, balance, and body awareness', 'object control, cooperative play, and active choices', 'SHAPE America National PE Standards', 'SHAPE: K Standard 1', 'https://www.shapeamerica.org/'),
  engineering: p('Engineering', 'noticing problems, materials, sketches, and building safely', 'testing, improving, and explaining a small solution', 'NGSS Engineering Design', 'NGSS.K-2-ETS1-1', 'https://www.nextgenscience.org/'),
  'living-library': p('Living Library', 'choosing books, asking questions, and book care', 'finding information, diverse voices, and sharing discoveries', 'AASL National School Library Standards', 'AASL: Inquire I.A.1', 'https://standards.aasl.org/'),
  'homestead-lab': p('Homestead Lab', 'self-care, routines, sorting, and helping safely at home', 'planning a simple household contribution and reflecting on care', 'Family and Consumer Sciences safety guidance', 'Teacher-designed supervised pathway', 'https://www.nasafacs.org/national-standards-overview.html'),
  'learning-commons': p('Learning Commons', 'questions, learning tools, collaboration, and digital care', 'finding, making, sharing, and improving work with feedback', 'AASL and ISTE student standards', 'ISTE: Knowledge Constructor 3a', 'https://iste.org/standards/students'),
  gardening: p('Gardening', 'seeds, soil, plant needs, and seasonal noticing', 'tending, harvest, pollinators, and sharing garden learning', 'NAAEE environmental education guidelines', 'NAAEE: Early Childhood Guidelines', 'https://naaee.org/eepro/resources/guidelines-excellence'),
  'mindful-movement': p('Mindful Movement', 'noticing breath, posture, feelings, and personal space', 'movement breaks, calming choices, and caring for self and others', 'CASEL supporting practices', 'CASEL: Self-awareness', 'https://casel.org/fundamentals-of-sel/'),
  spirit: p('Spirit', 'wonder, gratitude, family traditions, and belonging', 'kindness, reflection, service, and respectful questions', 'Family-directed, non-devotional pathway', 'Family-selected learning goal', 'https://www.unicef.org/parenting/child-care'),
  'fiber-arts': p('Fiber Arts', 'textures, weaving, threading, and safe material choices', 'simple patterns, stitching with adult support, and mending', 'National Core Arts Standards', 'VA:Cr2.1.Ka', 'https://www.nationalartsstandards.org/'),
  'drawing-and-illustration': p('Drawing & Illustration', 'lines, shapes, observation, and drawing tools', 'characters, settings, picture stories, and revision', 'National Core Arts Standards', 'VA:Cr2.1.Ka', 'https://www.nationalartsstandards.org/'),
  'painting-and-mixed-media': p('Painting & Mixed Media', 'color mixing, marks, collage, and material care', 'layering, composition, and an artist share', 'National Core Arts Standards', 'VA:Cr2.1.Ka', 'https://www.nationalartsstandards.org/'),
  'ceramics-and-sculpture': p('Ceramics & Sculpture', 'form, texture, pinch and coil exploration with soft materials', 'stable structures, sculpture stories, and safe display', 'National Core Arts Standards', 'VA:Cr2.1.Ka', 'https://www.nationalartsstandards.org/'),
  'photography-and-film': p('Photography & Film', 'seeing details, framing, and caring for a camera with an adult', 'photo stories, sequence, consent, and sharing safely', 'National Core Arts Standards', 'MA:Cr1.1.Ka', 'https://www.nationalartsstandards.org/'),
  'digital-art-and-design': p('Digital Art & Design', 'safe device routines, shapes, color, and simple digital marks', 'digital picture stories, choices, and kind feedback', 'National Core Arts Standards and ISTE', 'ISTE: Creative Communicator 6a', 'https://iste.org/standards/students'),
  woodworking: p('Woodworking', 'wood properties, measuring with non-cutting tools, and workshop safety', 'designing, sanding only with adult support, and assembling a simple model', 'Safety-first maker pathway', 'Teacher-designed supervised pathway', 'https://www.cpsc.gov/safety-education/safety-guides'),
  'metalwork-and-jewelry': p('Metalwork & Jewelry', 'metal objects, patterns, and safe soft-material jewelry design', 'beads, clasps with adult support, and wearable-art sharing', 'Safety-first maker pathway', 'Teacher-designed supervised pathway', 'https://www.cpsc.gov/safety-education/safety-guides'),
  'fashion-and-textile-design': p('Fashion & Textile Design', 'clothing needs, fabric textures, patterns, and care labels', 'designing an outfit collage, repair ideas, and respectful choices', 'Family and Consumer Sciences pathway', 'Teacher-designed supervised pathway', 'https://www.nasafacs.org/national-standards-overview.html'),
  'robotics-and-electronics': p('Robotics & Electronics', 'inputs, outputs, safe battery awareness, and robot directions', 'sensors through pretend play, simple circuits with adult support, and testing', 'CSTA K–12 Computer Science Standards', 'CSTA: 1A-AP-10', 'https://csteachers.org/k12standards/'),
  'maker-and-3d-design': p('Maker & 3D Design', 'shapes, joining materials, planning, and safe maker routines', 'models, testing, redesign, and explaining a creation', 'NGSS Engineering Design', 'NGSS.K-2-ETS1-1', 'https://www.nextgenscience.org/'),
  'culinary-arts-and-baking': p('Culinary Arts & Baking', 'kitchen routines, food groups, measuring, and no-heat preparation', 'mixing, recipe sequence, tasting respectfully, and cleanup', 'USDA nutrition education and food safety', 'Supervised food-preparation pathway', 'https://www.myplate.gov/'),
  'nutrition-and-food-science': p('Nutrition & Food Science', 'food groups, senses, hunger/fullness cues, and handwashing', 'where food comes from, food changes, and balanced snack planning', 'USDA MyPlate', 'MyPlate: Build healthy eating routines', 'https://www.myplate.gov/'),
  'healthy-cooking': p('Healthy Cooking', 'washing hands, produce, safe tools, and colorful foods', 'planning and preparing a simple supervised snack', 'USDA MyPlate and food safety guidance', 'Supervised food-preparation pathway', 'https://www.myplate.gov/'),
  'home-economics-and-life-skills': p('Home Economics & Life Skills', 'routines, sorting, clothing care, and helping at home', 'choices, needs, simple planning, and contributing to a shared space', 'Family and Consumer Sciences pathway', 'Teacher-designed supervised pathway', 'https://www.nasafacs.org/national-standards-overview.html'),
  'recipe-studio-and-food-culture': p('Recipe Studio & Food Culture', 'recipe pictures, family food stories, and kitchen safety', 'food traditions, ingredient maps, and a supervised recipe share', 'USDA nutrition education and cultural responsiveness', 'Supervised food-preparation pathway', 'https://www.myplate.gov/'),
  'animal-care': p('Animal Care & Horsemanship', 'animal needs, gentle observation, and safe boundaries', 'habitats, responsible care, and asking an expert questions', 'NGSS life science and humane education', 'NGSS.K-LS1-1', 'https://www.nextgenscience.org/'),
  'outdoor-adventure': p('Outdoor Adventure', 'outdoor rules, weather clothing, senses, and nature walks', 'navigation words, preparedness, teamwork, and leave-no-trace care', 'Leave No Trace and outdoor safety guidance', 'Leave No Trace: Respect Wildlife', 'https://lnt.org/why/7-principles/'),
  'fishing-and-water-skills': p('Fishing & Water Skills', 'water safety, fish observation, and shoreline stewardship', 'casting motions without hooks, life-jacket awareness, and aquatic habitats', 'Water safety and wildlife stewardship', 'Adult-supervised water safety pathway', 'https://www.redcross.org/take-a-class/swimming'),
  'archery-and-target-sports': p('Archery & Target Sports', 'range rules, focus, stance, and soft-target games only', 'aiming with safe non-projectile equipment and sportsmanship', 'Safety-first target-sports pathway', 'Adult-supervised non-projectile pathway', 'https://www.usarchery.org/'),
  'gymnastics-and-dance': p('Gymnastics & Dance', 'personal space, shapes, balance, levels, and rhythm', 'sequences, expressive movement, and safe landings', 'SHAPE America and National Core Arts Standards', 'SHAPE: K Standard 1', 'https://www.shapeamerica.org/'),
  'team-sports': p('Team Sports', 'rules, sharing space, rolling, catching, and cooperation', 'small-sided games, roles, encouragement, and fair play', 'SHAPE America National PE Standards', 'SHAPE: K Standard 4', 'https://www.shapeamerica.org/'),
  'individual-sports-and-fitness': p('Individual Sports & Fitness', 'movement choices, balance, effort, and personal goals', 'skill practice, noticing body signals, and celebrating growth', 'SHAPE America National PE Standards', 'SHAPE: K Standard 3', 'https://www.shapeamerica.org/'),
  'martial-arts': p('Martial Arts', 'respect, ready stance, balance, and non-contact movement forms', 'focus, self-control, movement sequences, and calming practice', 'Safety-first physical literacy pathway', 'Non-contact, adult-supervised pathway', 'https://www.shapeamerica.org/'),
  'skateboarding-and-cycling': p('Skateboarding & Cycling', 'helmet fit, road and driveway awareness, balance, and signals', 'safe riding decisions, equipment checks, and supervised skill practice', 'NHTSA bicycle safety guidance', 'Adult-supervised rider safety pathway', 'https://www.nhtsa.gov/road-safety/bicycle-safety'),
  'chess-and-strategy-games': p('Chess & Strategy Games', 'taking turns, game pieces, patterns, and planning one move', 'simple chess movement, fair play, and explaining a choice', 'Game-based reasoning pathway', 'Teacher-designed strategy pathway', 'https://www.uschess.org/'),
  'tabletop-game-design': p('Tabletop Game Design', 'rules, turn-taking, chance, and game materials', 'making, testing, and improving a simple cooperative game', 'Design and computational-thinking pathway', 'CSTA: 1A-AP-10', 'https://csteachers.org/k12standards/'),
  'model-building-and-miniatures': p('Model Building & Miniatures', 'scale language, shapes, joining, and careful material use', 'building a small scene, testing stability, and describing details', 'NGSS Engineering Design', 'NGSS.K-2-ETS1-1', 'https://www.nextgenscience.org/'),
  'theater-and-improv': p('Theater & Improv', 'voice, body, character, audience care, and pretend play', 'story sequence, simple scenes, collaboration, and performance reflection', 'National Core Arts Standards', 'TH:Cr1.1.Ka', 'https://www.nationalartsstandards.org/'),
  'debate-and-public-speaking': p('Debate & Public Speaking', 'listening, taking turns, stating a preference, and kind disagreement', 'giving reasons, asking questions, and sharing a short presentation', 'Common Core speaking and listening standards', 'CCSS.ELA-LITERACY.SL.K.1', 'https://corestandards.org/ela-literacy/'),
  'languages-and-culture': p('Languages & Culture', 'greetings, names, family languages, and respectful curiosity', 'songs, stories, everyday words, and honoring cultural differences', 'ACTFL World-Readiness Standards', 'ACTFL: Communication', 'https://www.actfl.org/educator-resources/world-readiness-standards-for-learning-languages'),
  'financial-literacy-and-entrepreneurship': p('Financial Literacy & Entrepreneurship', 'needs and wants, saving, sharing, and simple choice-making', 'earning through helpful work, pretend shops, and planning a goal', 'Council for Economic Education standards', 'CEE: Decision Making', 'https://www.councilforeconed.org/'),
  'automotive-and-mechanics': p('Automotive & Mechanics', 'wheels, motion, vehicle safety, and parts of a transportation system', 'simple machines, maintenance helpers do, and safe travel choices', 'NGSS physical science and safety guidance', 'NGSS.K-PS2-1', 'https://www.nextgenscience.org/'),
  'home-repair-and-diy': p('Home Repair & DIY', 'home safety, tools adults use, measuring, and fixing ideas', 'safe supervised making, care routines, and improving a small space', 'Safety-first maker pathway', 'Teacher-designed supervised pathway', 'https://www.cpsc.gov/safety-education/safety-guides'),
  'aviation-and-flight': p('Aviation & Flight', 'birds, paper airplanes, weather, and observing motion', 'lift through play, map symbols, and safe travel routines', 'NASA STEM and NGSS physical science', 'NGSS.K-PS2-1', 'https://www.nasa.gov/stem/'),
  'world-religions-and-belief': p('World Religions & Belief', 'family traditions, celebrations, and asking respectful questions', 'diverse beliefs, shared values, and learning about without practicing', 'Academic, comparative social studies pathway', 'C3: D2.Civ.10.K-2', 'https://www.socialstudies.org/standards/c3'),
  'world-politics-and-global-affairs': p('World Politics & Global Affairs', 'rules, fairness, helpers, and how groups make choices', 'children around the world, solving shared problems, and peaceful dialogue', 'C3 civics pathway', 'C3: D2.Civ.7.K-2', 'https://www.socialstudies.org/standards/c3'),
  'travel-and-global-citizenship': p('Travel & Global Citizenship', 'maps, packing, transportation, and being a thoughtful guest', 'homes and communities around the world, accessibility, and gratitude', 'C3 geography pathway', 'C3: D2.Geo.2.K-2', 'https://www.socialstudies.org/standards/c3'),
  'antiques-and-material-culture': p('Antiques & Material Culture', 'old and new objects, family stories, and caring for belongings', 'objects as clues, collections, and respectful stewardship', 'C3 historical inquiry pathway', 'C3: D2.His.2.K-2', 'https://www.socialstudies.org/standards/c3'),
  'coins-and-collectibles': p('Coins & Collectibles', 'sorting collections, noticing features, and care for objects', 'coins as history, cataloging, and responsible collecting', 'C3 inquiry and financial-literacy pathway', 'C3: D2.His.2.K-2', 'https://www.socialstudies.org/standards/c3'),
  'archaeology-and-museum-studies': p('Archaeology & Museum Studies', 'artifacts, clues, careful looking, and protecting objects', 'ethical digging simulations, labels, and a mini museum exhibit', 'C3 historical inquiry pathway', 'C3: D2.His.14.K-2', 'https://www.socialstudies.org/standards/c3'),
  'journalism-and-media-studies': p('Journalism & Media Studies', 'asking questions, drawing observations, and telling what happened', 'interviews, photo permission, fact versus pretend, and a class news share', 'Media-literacy and ELA pathway', 'CCSS.ELA-LITERACY.SL.K.1', 'https://corestandards.org/ela-literacy/'),
  'environmental-stewardship': p('Environmental Stewardship', 'living things, litter, reuse, and caring for a shared place', 'water, energy, habitats, and a small stewardship action', 'NAAEE and NGSS', 'NGSS.K-ESS3-1', 'https://naaee.org/eepro/resources/guidelines-excellence'),
  'anatomy-and-physiology': p('Anatomy & Physiology', 'five senses, body parts, healthy routines, and privacy', 'heart, lungs, bones, growth, and respecting human differences', 'NGSS life science and health literacy', 'NGSS.K-LS1-1', 'https://www.nextgenscience.org/'),
  'exercise-science': p('Exercise Science', 'heart rate awareness, warmups, movement types, and hydration', 'effort, rest, strength through play, and noticing progress', 'SHAPE America National PE Standards', 'SHAPE: K Standard 3', 'https://www.shapeamerica.org/'),
}

const phases = [
  ['Wonder and notice', 'I can notice details and share a question about'],
  ['Explore and practice', 'I can try a skill, use materials safely, and explain something I learned about'],
  ['Make and apply', 'I can use what I know to make, solve, move, or help with'],
  ['Reflect and share', 'I can show my learning, listen to feedback, and name a next step for'],
]
const verbs = ['Notice and talk', 'Try it together', 'Make or show', 'Share and reflect']

function lesson(subject, semesterTopic, phase, lessonNumber) {
  const focus = lessonNumber === 0 ? `a close look at ${semesterTopic}` : lessonNumber === 1 ? `a guided practice with ${semesterTopic}` : `a small creation or demonstration about ${semesterTopic}`
  const kind = lessonNumber === 0 ? 'learn' : lessonNumber === 1 ? 'practice' : 'create'
  return {
    id: `u${String(phase + 1).padStart(2, '0')}-l${String(lessonNumber + 1).padStart(2, '0')}`,
    title: `${verbs[lessonNumber]}: ${semesterTopic}`,
    objective: `${phases[phase][1]} ${semesterTopic} through ${focus}.`,
    estimatedMinutes: 25,
    prerequisites: phase === 0 ? [] : [`u${String(phase).padStart(2, '0')}-l03`],
    activities: [{
      id: `u${String(phase + 1).padStart(2, '0')}-l${String(lessonNumber + 1).padStart(2, '0')}-a01`,
      title: focus[0].toUpperCase() + focus.slice(1), kind,
      learnerAction: `With an adult or teacher nearby when needed, the learner participates in ${focus}, uses words, pictures, movement, or materials to communicate thinking, and cleans up safely.`,
      evidenceOptions: lessonNumber === 2 ? ['photo', 'audio', 'observation'] : ['audio', 'observation'], estimatedMinutes: 18,
    }],
    successCriteria: [
      `The learner participates safely and respectfully in ${semesterTopic}.`,
      `The learner communicates one observation, choice, or question using speech, drawing, movement, or a supported response.`,
    ],
  }
}

for (const [id, subject] of Object.entries(subjects)) {
  for (const semester of [1, 2]) {
    const topic = semester === 1 ? subject.s1 : subject.s2
    const units = phases.map(([title, outcome], phase) => ({
      id: `u${String(phase + 1).padStart(2, '0')}`,
      title: `${title}: ${topic}`,
      essentialQuestion: phase === 0 ? `What can we notice and wonder about ${topic}?` : phase === 1 ? `How can we learn and practice ${topic} safely?` : phase === 2 ? `How can we use ${topic} to make, solve, move, or help?` : `How can we share what we learned about ${topic}?`,
      outcomes: [`${outcome} ${topic}.`, 'I can use words, pictures, movement, or materials to communicate my thinking.'],
      standardIds: [subject.standard],
      lessons: [0, 1, 2].map(number => lesson(subject, topic, phase, number)),
    }))
    const manifest = {
      id: `kindergarten-${id}-semester-${String(semester).padStart(2, '0')}`,
      name: `Kindergarten ${subject.name} — Semester ${semester}`,
      description: `An 18-week, play-based Kindergarten pathway for ${topic}. Lessons are brief, hands-on, flexible, and designed for adult-guided learning.`,
      version: '1.0.0', subjectNames: [subject.name],
      learningGoals: [`Build confidence and curiosity with ${topic}.`, `Communicate learning through talk, drawing, movement, play, or a simple creation.`, 'Practice safe, kind, and responsible participation.'],
      lessons: units.flatMap(unit => unit.lessons).map(item => ({ title: item.title, objective: item.objective, minutes: item.estimatedMinutes })),
      resources: [{ title: subject.framework, url: subject.url, description: `Planning reference for this Kindergarten ${subject.name} pathway.` }],
      curriculum: { gradeId: 'kindergarten', subjectId: id, semester, pacing: { intendedWeeks: 18, flexible: true }, units },
    }
    const file = join(root, id, `${manifest.id}.module.json`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`)
  }
}
