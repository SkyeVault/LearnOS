export interface FarmQuest {
  id: string
  season: 'Any season' | 'Spring' | 'Summer' | 'Autumn' | 'Winter'
  age: string
  title: string
  mission: string
  learn: string
  safety: string
}

export const farmQuests: FarmQuest[] = [
  { id: 'soil-squeeze', season: 'Any season', age: 'All ages', title: 'Soil Detective', mission: 'Compare a pinch of soil from two safe places. Notice color, texture, smell, and what living things you can see without disturbing them.', learn: 'Soil is a living system of minerals, air, water, organic matter, and organisms.', safety: 'Wash hands after handling soil. Do not taste soil or touch unknown plants.' },
  { id: 'seed-map', season: 'Spring', age: 'All ages', title: 'Seed-to-Plant Map', mission: 'Choose a seed packet or edible plant. Draw its life cycle from seed to food, flower, or saved seed.', learn: 'Plants have needs and life cycles; different plants need different seasons and spaces.', safety: 'An adult chooses seeds and handles any tools.' },
  { id: 'sun-watch', season: 'Any season', age: 'Ages 6+', title: 'Sun and Shade Survey', mission: 'With a trusted adult, revisit one outdoor area at three times of day. Mark sun, shade, wind, and water clues.', learn: 'Microclimates help determine what can grow well in a place.', safety: 'Stay within the agreed outdoor boundary and use sun protection.' },
  { id: 'water-wise', season: 'Summer', age: 'All ages', title: 'Water Wise', mission: 'Observe where water goes after rain or watering. Sketch one way to reduce waste or help a plant get water slowly.', learn: 'Water moves through soil, plants, air, and communities.', safety: 'Never drink from outdoor containers or standing water.' },
  { id: 'compost-sort', season: 'Any season', age: 'Ages 6+', title: 'Compost Sort', mission: 'With an adult, sort safe kitchen scraps into “can compost,” “cannot compost here,” and “ask first.”', learn: 'Decomposers return nutrients to soil, but compost systems need balanced inputs.', safety: 'Use adult-approved scraps only; wash hands afterward.' },
  { id: 'pollinator-count', season: 'Spring', age: 'All ages', title: 'Pollinator Pause', mission: 'Watch flowers from a respectful distance for five minutes. Count visits and draw one visitor.', learn: 'Pollinators help many plants reproduce and support food systems.', safety: 'Do not touch insects, nests, or unknown flowers.' },
  { id: 'food-mile', season: 'Any season', age: 'Ages 8+', title: 'Food Journey', mission: 'Choose one meal ingredient and map its possible path: growing, harvesting, processing, transport, cooking, and composting.', learn: 'Food systems involve land, labor, energy, culture, and choices.', safety: 'Use packages and labels; do not handle raw food without an adult.' },
  { id: 'farm-build', season: 'Any season', age: 'All ages', title: 'Mini Farm Engineer', mission: 'Build a model fence, rain shelter, raised bed, or irrigation path from blocks, paper, or recycled materials.', learn: 'Farm design balances needs: water, shelter, access, safety, and care.', safety: 'Use only adult-approved materials and tools.' },
  { id: 'harvest-share', season: 'Autumn', age: 'All ages', title: 'Harvest and Share', mission: 'List three ways a harvest can be used, saved, shared, or composted. Create a thank-you note for the people who grew food.', learn: 'Food stewardship includes gratitude, storage, sharing, and minimizing waste.', safety: 'Ask an adult before harvesting or preserving anything.' },
  { id: 'winter-plan', season: 'Winter', age: 'Ages 8+', title: 'Next Season Planner', mission: 'Plan one small growing experiment. Write the question, materials, what you will change, and how you will observe it.', learn: 'Good experiments compare fairly and document observations over time.', safety: 'Use only safe, adult-approved indoor growing materials.' },
  { id: 'animal-needs', season: 'Any season', age: 'All ages', title: 'Animal Care Needs', mission: 'Choose a farm animal and make a needs chart: food, water, shelter, space, social needs, and daily care.', learn: 'Animals are living beings with species-specific needs and require responsible adult care.', safety: 'Never approach, feed, or handle animals without the owner or a trusted adult.' },
  { id: 'weather-log', season: 'Any season', age: 'All ages', title: 'Garden Weather Log', mission: 'Record temperature feeling, clouds, wind, and precipitation for seven days using words or symbols.', learn: 'Weather observations support garden planning and scientific thinking.', safety: 'Observe from a safe place; go indoors during lightning or severe weather.' },
]

export const farmFieldNotes = [
  ['Soil', 'Living soil feeds plants through a web of organisms, air, water, minerals, and organic matter.'],
  ['Seeds', 'Seeds carry a young plant and stored food. Germination needs the right balance of water, temperature, and air.'],
  ['Water', 'Plants need water, but roots also need oxygen; soggy soil can be as difficult as dry soil.'],
  ['Biodiversity', 'A variety of plants, insects, birds, fungi, and microbes can make a growing space more resilient.'],
  ['Food systems', 'Growing food connects science, history, culture, economics, nutrition, work, and community.'],
]
