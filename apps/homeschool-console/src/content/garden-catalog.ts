export type GardenPlantType = "Flower" | "Vegetable" | "Herb"

export interface GardenPlantProfile {
  id: string
  type: GardenPlantType
  name: string
  start: string
  light: string
  water: string
  grow: string
  harvestOrBloom: string
  note: string
}

export const gardenPlantTypes: Array<GardenPlantType | "All"> = ["All", "Flower", "Vegetable", "Herb"]

export const gardenPlantProfiles: GardenPlantProfile[] = [
  { id: "marigold", type: "Flower", name: "Marigold", start: "Start from seed or a young plant after local frost risk has passed.", light: "Full sun", water: "Water at the soil when it is dry; avoid constantly soggy soil.", grow: "Give plants room for airflow and remove faded flowers if you want more blooms.", harvestOrBloom: "Blooms through warm weather", note: "Check the seed packet for the mature size of your variety." },
  { id: "zinnia", type: "Flower", name: "Zinnia", start: "Sow in warm soil or transplant after frost risk has passed.", light: "Full sun", water: "Water the soil deeply, then let the surface dry slightly.", grow: "Use well-drained soil and keep leaves as dry as practical to help prevent disease.", harvestOrBloom: "Summer to frost", note: "Many zinnias attract pollinators; choose varieties with pollen and nectar if that is a goal." },
  { id: "sunflower", type: "Flower", name: "Sunflower", start: "Direct sow after local frost risk has passed.", light: "Full sun", water: "Water while seedlings establish; deep roots help later.", grow: "Choose a spot with enough height and support for the variety.", harvestOrBloom: "Summer to early autumn", note: "Tall varieties may need staking in windy places." },
  { id: "lettuce", type: "Vegetable", name: "Leaf Lettuce", start: "Cool-season crop; sow or transplant when local conditions are suitable.", light: "Sun to light shade", water: "Keep soil evenly moist, not waterlogged.", grow: "Sow small amounts in succession for repeated harvests.", harvestOrBloom: "Pick outer leaves as they become usable", note: "Heat can make lettuce bitter or cause it to bolt; use local timing guidance." },
  { id: "radish", type: "Vegetable", name: "Radish", start: "Cool-season direct-sown crop.", light: "Sun to light shade", water: "Keep soil evenly moist for tender roots.", grow: "Thin seedlings so roots have room to form.", harvestOrBloom: "Often ready quickly; check the seed packet", note: "Sow in small rounds rather than all at once for a longer harvest." },
  { id: "bush-bean", type: "Vegetable", name: "Bush Bean", start: "Direct sow after soil is warm and frost risk has passed.", light: "Full sun", water: "Water at the soil, especially while flowering and forming pods.", grow: "Avoid working around plants when leaves are wet.", harvestOrBloom: "Pick pods regularly when young and tender", note: "Beans dislike cold soil; use local planting dates." },
  { id: "tomato", type: "Vegetable", name: "Tomato", start: "Set out sturdy transplants after frost risk has passed and soil warms.", light: "Full sun", water: "Water the soil consistently and deeply.", grow: "Add a stake or cage at planting and give plants room for airflow.", harvestOrBloom: "Pick ripe fruit before cold weather", note: "Choose a bush type for compact spaces or containers, or a vining type with support." },
  { id: "basil", type: "Herb", name: "Basil", start: "Plant after warm weather arrives; basil dislikes cold soil and frost.", light: "Full sun", water: "Keep soil evenly moist with good drainage.", grow: "Pinch or harvest stems above a leaf pair to encourage branching.", harvestOrBloom: "Harvest leaves before flowering for kitchen use", note: "Bring indoors before cold nights if growing in a pot." },
  { id: "parsley", type: "Herb", name: "Parsley", start: "Direct seed or use a young plant; germination can be slow.", light: "Sun to light shade", water: "Water deeply when soil begins to dry.", grow: "Use well-drained, organic-matter-rich soil.", harvestOrBloom: "Snip outer stems near the base", note: "Parsley can grow indoors in a bright pot with drainage." },
  { id: "mint", type: "Herb", name: "Mint", start: "Start from a plant or cutting in a container.", light: "Sun to part shade", water: "Keep soil consistently moist but not soggy.", grow: "Grow in a pot because mint can spread aggressively in a garden bed.", harvestOrBloom: "Pinch leaves and stems regularly", note: "Label the pot and keep it separate from other herbs." },
]
