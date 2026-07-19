export interface ToolkitCard {
  title: string
  ages: string
  challenge: string
  materials: string[]
  reflection: string
}

const engineeringGoals = ['carry a small toy', 'cross a gap', 'protect an egg-shaped object', 'sort objects by size', 'move a message', 'hold a book upright', 'make a shadow', 'measure a room']
const engineeringMaterials = ['paper and tape', 'cardboard and string', 'recycled containers', 'craft sticks and rubber bands', 'blocks and fabric', 'foil and cups', 'books and clothespins', 'natural objects from outside']
const engineeringLimits = ['using only 10 pieces', 'without using scissors', 'in under 15 minutes', 'with one hand', 'so it can be rebuilt', 'with a 30 cm size limit', 'so another person can use it', 'with a labeled diagram first']

export const engineeringDeck: ToolkitCard[] = Array.from({ length: 64 }, (_, index) => ({
  title: `Design Mission ${index + 1}`,
  ages: index % 3 === 0 ? 'Ages 5–8' : index % 3 === 1 ? 'Ages 8–12' : 'Ages 12+',
  challenge: `Design something that can ${engineeringGoals[index % engineeringGoals.length]} using ${engineeringMaterials[Math.floor(index / 2) % engineeringMaterials.length]}, ${engineeringLimits[Math.floor(index / 5) % engineeringLimits.length]}.`,
  materials: [engineeringMaterials[Math.floor(index / 2) % engineeringMaterials.length], 'Pencil and paper for a design sketch', 'A timer, if helpful'],
  reflection: 'What failed first? What evidence tells you your revision improved the design?',
}))

const artVerbs = ['layer', 'repeat', 'trace', 'weave', 'fold', 'stipple', 'blend', 'collage', 'print', 'tear', 'shade', 'pattern']
const artSubjects = ['a weather memory', 'a tiny imaginary ecosystem', 'a helpful invention', 'a family tradition', 'a sound you can see', 'a map of a dream', 'a room from a bird’s view', 'a garden in four seasons']
const artConstraints = ['using only three colors', 'without lifting your pencil for one minute', 'with one recycled material', 'with a pattern hidden inside', 'using positive and negative space', 'with a before-and-after story', 'in two contrasting textures', 'using a border that explains the work']

export const artDeck: ToolkitCard[] = Array.from({ length: 72 }, (_, index) => ({
  title: `Studio Spark ${index + 1}`,
  ages: 'All ages',
  challenge: `${artVerbs[index % artVerbs.length]} ${artSubjects[Math.floor(index / 3) % artSubjects.length]} ${artConstraints[Math.floor(index / 7) % artConstraints.length]}.`,
  materials: ['Any drawing or collage materials you already own', 'Optional: a local clip-art token as a starting point'],
  reflection: 'Give the work a title. What choice did you make on purpose?',
}))

export const technologyDeck: ToolkitCard[] = [
  { title: 'Algorithm Chef', ages: 'Ages 5–9', challenge: 'Write exact steps for making a snack or getting ready to go outside. Ask a partner to follow them literally.', materials: ['Paper', 'Pencil'], reflection: 'Which instruction was too vague? Rewrite it.' },
  { title: 'Binary Bracelet', ages: 'Ages 8–12', challenge: 'Use two colors of beads or marks to encode the numbers 0–15 in binary.', materials: ['Two colors of beads, paper, or counters'], reflection: 'How many different values can four binary places represent?' },
  { title: 'Human Computer', ages: 'All ages', challenge: 'Choose one person as input, one as processor, and one as output. Pass a rule through the system.', materials: ['Index cards'], reflection: 'What happens when the input is missing or incorrect?' },
  { title: 'Data Detective', ages: 'Ages 8–12', challenge: 'Collect a small, consent-based data set from your day: steps, weather, books, or meals. Make a chart.', materials: ['Notebook', 'Pencil'], reflection: 'What can the data show, and what can it not show?' },
  { title: 'Encryption Note', ages: 'Ages 10+', challenge: 'Invent a substitution cipher and write a kind secret message. Exchange keys only with a trusted person.', materials: ['Paper', 'Pencil'], reflection: 'Why is a secret key useful?' },
  { title: 'Debug the Directions', ages: 'All ages', challenge: 'Find three confusing instructions in a game or chore. Make them testable and clear.', materials: ['Any instruction sheet'], reflection: 'How did you know the revised version worked?' },
]

export const practicalLifeDeck: ToolkitCard[] = [
  { title: 'Pantry Scientist', ages: 'All ages', challenge: 'Sort a shelf by category, then make a simple inventory with tallies.', materials: ['Pantry or supply shelf', 'Paper'], reflection: 'What system makes it easiest for everyone to help?' },
  { title: 'Seed-to-Table Map', ages: 'All ages', challenge: 'Choose one food and map its journey from soil or water to your table.', materials: ['Paper', 'Local food label if available'], reflection: 'Which part of the journey surprised you?' },
  { title: 'Mending Mindset', ages: 'Ages 8+', challenge: 'Identify one safe repair, cleaning, or organizing task with an adult. Make a before-and-after record.', materials: ['Adult-approved supplies'], reflection: 'What is worth caring for rather than replacing?' },
  { title: 'Neighborhood Notice', ages: 'All ages', challenge: 'Take a slow walk with a trusted adult and notice three systems: water, waste, transportation, or community care.', materials: ['Notebook'], reflection: 'What people and tools keep this system working?' },
]

export function makeMathChallenge(level: 'sprout' | 'trail' | 'summit') {
  const max = level === 'sprout' ? 10 : level === 'trail' ? 50 : 500
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  const operation = ['+', '−', '×'][Math.floor(Math.random() * 3)]
  const left = operation === '−' ? Math.max(a, b) : a
  const right = operation === '−' ? Math.min(a, b) : b
  const answer = operation === '+' ? left + right : operation === '−' ? left - right : left * right
  return { prompt: `${left} ${operation} ${right} = ?`, answer, hint: operation === '×' ? 'Try drawing equal groups.' : 'Use a drawing, counters, or a number line.' }
}
