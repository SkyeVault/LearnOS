export type CulturalShelf = 'art' | 'history' | 'science' | 'community'

export interface CulturalResource {
  id: string
  shelf: CulturalShelf
  title: string
  provider: string
  grades: string
  description: string
  url: string
  reuse: 'CC0 / public domain collection' | 'Open with attribution review' | 'Free link; check item rights'
  learningMoves: string[]
}

/** Link-first cultural learning resources. Rights metadata must travel with any downloaded asset. */
export const culturalLibrary: CulturalResource[] = [
  {
    id: 'aic-public-domain', shelf: 'art', title: 'Art Institute of Chicago: Public-Domain Artworks', provider: 'Art Institute of Chicago', grades: 'K–12',
    description: 'Explore paintings, sculpture, prints, textiles, and design objects through a public API and IIIF images.',
    url: 'https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&limit=12', reuse: 'CC0 / public domain collection',
    learningMoves: ['Slow-look: notice ten details before naming the work.', 'Compare two works from different places or eras.', 'Make a museum label with title, materials, date, and a child-written interpretation.'],
  },
  {
    id: 'met-open-access', shelf: 'art', title: 'The Met: Open Access Collection', provider: 'The Metropolitan Museum of Art', grades: 'K–12',
    description: 'Public-domain artwork data and high-resolution images across global cultures and time periods.',
    url: 'https://www.metmuseum.org/art/collection', reuse: 'CC0 / public domain collection',
    learningMoves: ['Build a timeline using five objects.', 'Trace how artists use pattern, color, or symbols.', 'Curate a mini-exhibition around one big question.'],
  },
  {
    id: 'smithsonian-open-access', shelf: 'art', title: 'Smithsonian Open Access', provider: 'Smithsonian Institution', grades: 'K–12',
    description: 'Millions of CC0 2D and 3D items spanning art, culture, natural history, science, and design.',
    url: 'https://www.si.edu/openaccess', reuse: 'CC0 / public domain collection',
    learningMoves: ['Use 3D objects to practice observation and scale.', 'Create a “then and now” object comparison.', 'Research the maker, community, material, and function before interpreting an object.'],
  },
  {
    id: 'loc-free-reuse', shelf: 'history', title: 'Library of Congress: Free to Use and Reuse', provider: 'Library of Congress', grades: 'K–12',
    description: 'Themed primary-source sets of photographs, maps, prints, recordings, film, and manuscripts with rights guidance.',
    url: 'https://www.loc.gov/free-to-use/', reuse: 'CC0 / public domain collection',
    learningMoves: ['Source it: who made this, when, and why?', 'Corroborate with a second source.', 'Ask whose voice is missing and what evidence could help.'],
  },
  {
    id: 'loc-classroom', shelf: 'history', title: 'Library of Congress Classroom Materials', provider: 'Library of Congress', grades: 'K–12',
    description: 'Ready-to-use primary-source sets, teacher guides, and lesson plans for history, civics, geography, literature, and media literacy.',
    url: 'https://www.loc.gov/programs/teachers/classroom-materials/', reuse: 'Free link; check item rights',
    learningMoves: ['Use the primary-source analysis triangle: observe, reflect, question.', 'Build a local-history evidence board.', 'Write a caption that distinguishes fact from inference.'],
  },
  {
    id: 'nasa-multimedia', shelf: 'science', title: 'NASA Multimedia and Learning Media', provider: 'NASA', grades: 'K–12',
    description: 'Space, earth, climate, data sonifications, e-books, visualizations, images, and 3D learning resources.',
    url: 'https://www.nasa.gov/multimedia/', reuse: 'Open with attribution review',
    learningMoves: ['Turn a NASA image into a science notebook observation.', 'Listen to a data sonification and describe patterns.', 'Compare a mission image with a child-made scale model.'],
  },
  {
    id: 'family-neighborhood', shelf: 'community', title: 'Family and Neighborhood Archive', provider: 'Learning World OS', grades: 'PreK–12',
    description: 'A private, local record of household objects, oral histories, photos, recipes, keepsakes, and community stories.',
    url: 'local://family-archive', reuse: 'Free link; check item rights',
    learningMoves: ['Interview a trusted adult using consent.', 'Record provenance: who owned it and how it came to the family.', 'Photograph an object from multiple angles without handling fragile items.'],
  },
]
