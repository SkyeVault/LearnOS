export type MovementPractice = 'Yoga' | 'Tai Chi' | 'Qigong'

export interface MovementCard {
  id: string
  practice: MovementPractice
  name: string
  pronunciation?: string
  level: 'Gentle' | 'Foundation' | 'Challenge'
  cue: string
  adaptation: string
}

const yoga: Array<[string, string, string, string]> = [
  ['Mountain', 'Stand tall with feet comfortable, arms relaxed, and eyes forward.', 'Practice seated with feet grounded.', 'Gentle'],
  ['Easy Seat', 'Sit comfortably upright and notice a natural breath.', 'Use a chair or cushion for support.', 'Gentle'],
  ['Child’s Pose', 'Fold forward only as far as feels comfortable, with knees apart or together.', 'Rest forehead on stacked hands or use a chair.', 'Gentle'],
  ['Cat–Cow', 'On hands and knees, gently round then lengthen the spine with easy breathing.', 'Do the same movements seated with hands on thighs.', 'Gentle'],
  ['Downward-Facing Dog', 'From hands and feet, lengthen the back without forcing heels down.', 'Use hands on a wall or chair instead.', 'Foundation'],
  ['Tabletop', 'Place hands under shoulders and knees under hips with a long, steady back.', 'Use a standing wall version.', 'Gentle'],
  ['Cobra', 'Lie on the belly and gently lift the chest using back muscles; keep neck long.', 'Lift only a little or stay resting on forearms.', 'Foundation'],
  ['Sphinx', 'Rest on forearms with the chest open gently.', 'Place a folded towel under the chest if needed.', 'Gentle'],
  ['Bridge', 'Lie on the back, bend knees, and lift hips only comfortably.', 'Keep hips down and practice the setup instead.', 'Foundation'],
  ['Tree', 'Balance with one foot grounded; place the other foot low on ankle or calf, never the knee.', 'Keep toes on floor or hold a wall.', 'Foundation'],
  ['Warrior I', 'Take a stable stance and reach upward without straining.', 'Shorten the stance or use a chair for balance.', 'Foundation'],
  ['Warrior II', 'Open arms wide over a comfortable bent front knee.', 'Use a shorter stance and smaller bend.', 'Foundation'],
  ['Triangle', 'Lengthen both sides of the body and rest a hand on shin or a block.', 'Keep hand on hip and practice the side reach.', 'Foundation'],
  ['Chair', 'Bend knees as if sitting back, with weight comfortable in the feet.', 'Use an actual chair to practice standing and sitting slowly.', 'Foundation'],
  ['Seated Forward Fold', 'Sit tall and hinge forward gently without pulling.', 'Keep knees bent or use a chair.', 'Gentle'],
  ['Butterfly', 'Sit with soles together and allow knees to rest naturally.', 'Place cushions under knees or sit on a chair.', 'Gentle'],
  ['Figure Four', 'Create a relaxed ankle-over-knee shape without pressing the knee.', 'Practice lying down or skip the cross.', 'Gentle'],
  ['Legs Up the Wall', 'Rest with legs supported on a wall only if comfortable and supervised.', 'Lie on the floor with calves on a chair.', 'Gentle'],
  ['Savasana', 'Rest quietly in any comfortable position and notice sounds and breath.', 'Use a chair, side-lying position, or eyes open.', 'Gentle'],
]

const taiChi: Array<[string, string, string, string]> = [
  ['Opening and Closing', 'Stand or sit tall; slowly float hands up and let them settle down.', 'Use a smaller range or keep hands on thighs.', 'Gentle'],
  ['Weight Shift', 'Move weight slowly from one foot to the other without locking knees.', 'Hold a counter or practice seated side-to-side.', 'Gentle'],
  ['Cloud Hands', 'Let hands drift side to side while turning only comfortably.', 'Keep feet still or use only arms.', 'Foundation'],
  ['Parting the Wild Horse’s Mane', 'Step gently and sweep one hand forward, one hand back.', 'Skip the step and practice arms seated.', 'Foundation'],
  ['Brush Knee', 'Coordinate a soft forward step with one hand brushing down and one reaching forward.', 'Practice from a stable stance.', 'Foundation'],
  ['Golden Rooster', 'Lift one knee only as high as balance allows while one hand rises.', 'Keep toes touching floor or hold support.', 'Challenge'],
  ['Wave Hands Like Clouds', 'Make slow circles with arms and an easy side shift.', 'Use a seated arm-only version.', 'Gentle'],
  ['Closing Form', 'Return to a comfortable stance and let hands rest by the sides.', 'Any seated or standing finish is welcome.', 'Gentle'],
]

const qigong: Array<[string, string, string, string]> = [
  ['Ground and Notice', 'Stand or sit comfortably, feel support beneath you, and breathe naturally.', 'Keep eyes open and use chair support.', 'Gentle'],
  ['Gather the Air', 'Float hands outward and inward slowly as if gathering a soft cloud.', 'Use a small arm range.', 'Gentle'],
  ['Lift the Sky', 'Raise arms only as high as shoulders or comfort allows, then lower slowly.', 'Keep elbows bent or do one arm at a time.', 'Gentle'],
  ['Paint the Rainbow', 'Sweep one arm overhead in a relaxed arc, then switch sides.', 'Draw a small arc in front of the body.', 'Foundation'],
  ['Push the Mountain', 'Gently press palms forward, then relax them back.', 'Practice seated with elbows close.', 'Gentle'],
  ['Side-to-Side River', 'Let the torso turn slightly as arms drift across the body.', 'Keep hips facing forward and use arms only.', 'Gentle'],
  ['Quiet Standing', 'Stand comfortably for a short moment and notice posture without forcing it.', 'Sit with both feet grounded.', 'Gentle'],
  ['Closing Breath', 'Place hands wherever comfortable and take a few unforced breaths.', 'Simply pause and notice three sounds.', 'Gentle'],
]

function cards(practice: MovementPractice, source: Array<[string, string, string, string]>) {
  return source.map(([name, cue, adaptation, level], index) => ({ id: `${practice.toLowerCase().replaceAll(' ', '-')}-${index + 1}`, practice, name, level: level as MovementCard['level'], cue, adaptation }))
}

export const movementCards: MovementCard[] = [...cards('Yoga', yoga), ...cards('Tai Chi', taiChi), ...cards('Qigong', qigong)]
