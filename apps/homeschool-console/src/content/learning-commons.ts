export type CommonsPillar = 'Think' | 'Make' | 'Move' | 'Care' | 'Belong'

export interface CommonsMission {
  id: string
  pillar: CommonsPillar
  title: string
  ages: string
  mission: string
  why: string
  evidence: string
}

const seeds: Array<[CommonsPillar, string, string, string, string, string]> = [
  ['Think', 'Question the Claim', 'Ages 8+', 'Find one claim you hear today. Ask: who said it, what evidence supports it, and what would change your mind?', 'Truth-seeking is a skill, not a personality trait.', 'Write the claim, two questions, and one next step.'],
  ['Think', 'Two Ways to Solve', 'All ages', 'Solve one ordinary problem in two different ways: reach a shelf, sort a collection, add numbers, or explain an idea.', 'Flexible thinkers are harder to trap in one answer.', 'Draw both strategies and circle what each one does well.'],
  ['Think', 'Notice What Is Missing', 'Ages 8+', 'Look at a story, chart, advertisement, or history lesson. Name one voice, detail, or question that is absent.', 'Good learning includes the courage to notice gaps.', 'Write “I wonder about…” three times.'],
  ['Make', 'Repair Before Replace', 'All ages', 'With an adult, identify one safe object that can be cleaned, organized, mended, or repurposed.', 'Making and maintaining build independence and care.', 'Capture a before-and-after sketch or photo.'],
  ['Make', 'Teach It Back', 'All ages', 'Choose one thing you know and teach it to a younger child, a parent, or a stuffed animal.', 'Teaching reveals what we understand and what we need to learn.', 'Record the learner’s question and your improved explanation.'],
  ['Make', 'Build for a Real Person', 'Ages 6+', 'Design a sign, tool, organizer, game, or comfort object for someone in your home.', 'Design starts with listening to a real need.', 'Ask the person for feedback; note one revision.'],
  ['Move', 'Body Data', 'All ages', 'Try three kinds of movement: steady, powerful, and gentle. Notice breath, heartbeat, balance, and mood.', 'Bodies are part of learning, not a break from it.', 'Choose a symbol for how each movement felt.'],
  ['Move', 'Map the Accessible Route', 'Ages 8+', 'Walk a familiar route and notice what makes it easy or difficult for a stroller, wheelchair, small child, or tired person.', 'Communities work better when we notice one another.', 'Sketch one change that would make the route kinder.'],
  ['Care', 'Food Story', 'All ages', 'Choose one food and learn one thing about where it came from, who prepared it, or how it travels.', 'Daily life connects us to land, labor, and culture.', 'Make a five-step food journey map.'],
  ['Care', 'Kindness With Boundaries', 'Ages 8+', 'Practice a sentence that is both kind and clear: “I care about this, and I need…”', 'Care includes consent, limits, and self-respect.', 'Write a sentence you could use in real life.'],
  ['Care', 'Tend a Shared Space', 'All ages', 'Choose a small shared space and make it easier for the next person to use.', 'Stewardship is a quiet form of leadership.', 'List what you changed and why it matters.'],
  ['Belong', 'Family Story Keeper', 'All ages', 'Ask a trusted adult about an object, place, recipe, saying, or tradition. Ask permission before recording it.', 'Every family carries knowledge worth preserving.', 'Save a title, one quote, and one question in the Family Archive.'],
  ['Belong', 'Community Asset Hunt', 'All ages', 'Notice three people, places, or systems that help your neighborhood work.', 'Civic life begins with seeing the helpers already around us.', 'Draw a map connecting the three assets.'],
  ['Belong', 'Brave, Respectful Disagreement', 'Ages 10+', 'Pick a low-stakes topic. Practice explaining two viewpoints fairly before sharing your own.', 'Democracy requires courage and fairness together.', 'Write the strongest version of each view.'],
]

export const commonsMissions: CommonsMission[] = Array.from({ length: 70 }, (_, index) => {
  const [pillar, title, ages, mission, why, evidence] = seeds[index % seeds.length]
  return { id: `commons-${index + 1}`, pillar, title: index < seeds.length ? title : `${title} — Remix ${Math.floor(index / seeds.length) + 1}`, ages, mission, why, evidence }
})
