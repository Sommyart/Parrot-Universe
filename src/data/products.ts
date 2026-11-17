// Demonstration catalogue only. No live animals are offered for sale.
// Prices are sample values, not real prices or available inventory.
// Lifespan figures are commonly cited approximate ranges for birds in human care;
// they vary widely with diet, housing and veterinary care.

export type SizeCategory = 'Small' | 'Medium' | 'Large' | 'Giant'

export interface Parrot {
  id: string
  name: string
  scientificName: string
  wikiTitle: string // used to fetch a real photo from Wikipedia / Wikimedia Commons
  price: number
  size: SizeCategory
  lengthCm: string
  lifespan: string
  short: string
  description: string
  temperament: string[]
  diet: string
  care: string[]
  accent: string
  relatedAccessories: string[]
}

export const parrots: Parrot[] = [
  {
    id: 'african-grey-parrot',
    name: 'African Grey Parrot',
    scientificName: 'Psittacus erithacus',
    wikiTitle: 'Grey_parrot',
    price: 1800,
    size: 'Large',
    lengthCm: 'approx. 33 cm',
    lifespan: 'Often cited as 40 to 60 years in human care',
    short: 'Famed for remarkable vocal mimicry and problem-solving ability.',
    description:
      'The African Grey is one of the most studied parrots in cognition research. Its soft grey plumage and bright red tail hide a sensitive, observant personality that thrives on routine and mental challenge.',
    temperament: ['Highly intelligent', 'Sensitive to change', 'Bonds closely', 'Strong talker'],
    diet: 'A quality pelleted base with fresh vegetables, some fruit, and calcium-rich foods; avian vets often monitor calcium and vitamin D levels in this species.',
    care: ['Daily foraging and puzzle enrichment', 'Predictable routine', 'Large cage with room to climb', 'Regular avian vet checks'],
    accent: '#9aa3a0',
    relatedAccessories: ['foraging-puzzle-set', 'premium-pellet-blend', 'flight-cage-xl'],
  },
  {
    id: 'blue-and-gold-macaw',
    name: 'Blue-and-Gold Macaw',
    scientificName: 'Ara ararauna',
    wikiTitle: 'Blue-and-yellow_macaw',
    price: 2500,
    size: 'Giant',
    lengthCm: 'approx. 76 to 86 cm',
    lifespan: 'Commonly cited as 35 to 50+ years in human care',
    short: 'A striking, social giant with turquoise wings and a golden chest.',
    description:
      'Blue-and-Gold Macaws are outgoing and playful, with a powerful beak and a loud contact call. They need a large living space, lots of chewable toys and plenty of daily interaction.',
    temperament: ['Social and outgoing', 'Playful', 'Loud', 'Needs lots of attention'],
    diet: 'Pellets plus a wide range of vegetables and fruit, with nuts in moderation as larger macaws benefit from some healthy fats.',
    care: ['Very large enclosure or aviary', 'Destructible wooden toys', 'Several hours out of cage daily', 'Noise-tolerant household'],
    accent: '#2f7fc1',
    relatedAccessories: ['hardwood-play-stand', 'chew-toy-bundle', 'flight-cage-xl'],
  },
  {
    id: 'scarlet-macaw',
    name: 'Scarlet Macaw',
    scientificName: 'Ara macao',
    wikiTitle: 'Scarlet_macaw',
    price: 3200,
    size: 'Giant',
    lengthCm: 'approx. 81 to 96 cm',
    lifespan: 'Commonly cited as 40 to 50+ years in human care',
    short: 'Our signature bird: brilliant red, blue and gold plumage.',
    description:
      'The Scarlet Macaw is the star of Parrot Universe. Native to Central and South American forests, it is energetic, curious and strong-willed, and needs an experienced keeper.',
    temperament: ['Energetic', 'Curious', 'Strong-willed', 'Affectionate with trust'],
    diet: 'Pellets, fresh produce and occasional nuts; many keepers add sprouted seeds and leafy greens for variety.',
    care: ['Aviary-sized space', 'Daily flight or exercise time', 'Consistent training', 'Experienced owner recommended'],
    accent: '#d7263d',
    relatedAccessories: ['hardwood-play-stand', 'premium-pellet-blend', 'grooming-kit'],
  },
  {
    id: 'sun-conure',
    name: 'Sun Conure',
    scientificName: 'Aratinga solstitialis',
    wikiTitle: 'Sun_parakeet',
    price: 650,
    size: 'Medium',
    lengthCm: 'approx. 30 cm',
    lifespan: 'Often cited as 15 to 30 years in human care',
    short: 'A burst of sunset orange with a big, cheerful personality.',
    description:
      'Sun Conures are vivid, affectionate and famously vocal. They love to snuggle and play, and do best with owners who enjoy an active, chatty companion.',
    temperament: ['Affectionate', 'Playful', 'Very vocal', 'Cuddly'],
    diet: 'Pellets with fresh vegetables and fruit; seeds as occasional treats only.',
    care: ['Bathing opportunities', 'Shreddable toys', 'Daily social time', 'Sleep tent or covered cage at night'],
    accent: '#f59e0b',
    relatedAccessories: ['chew-toy-bundle', 'stainless-bowl-trio', 'foraging-puzzle-set'],
  },
  {
    id: 'green-cheeked-conure',
    name: 'Green-Cheeked Conure',
    scientificName: 'Pyrrhura molinae',
    wikiTitle: 'Green-cheeked_parakeet',
    price: 450,
    size: 'Small',
    lengthCm: 'approx. 26 cm',
    lifespan: 'Often cited as 10 to 25 years in human care',
    short: 'Pocket-sized clown: quieter than most conures, full of mischief.',
    description:
      'Green-cheeked Conures are a popular choice for apartment living thanks to a softer voice. They are inquisitive, love to hide in pockets and hoodies, and pick up tricks quickly.',
    temperament: ['Inquisitive', 'Comical', 'Relatively quiet', 'Trainable'],
    diet: 'Small-pellet base with chopped vegetables, some fruit, and limited seed treats.',
    care: ['Snuggle hut or tent', 'Foot toys', 'Short daily training sessions', 'Safe out-of-cage play area'],
    accent: '#4c9a2a',
    relatedAccessories: ['stainless-bowl-trio', 'chew-toy-bundle', 'grooming-kit'],
  },
  {
    id: 'cockatiel',
    name: 'Cockatiel',
    scientificName: 'Nymphicus hollandicus',
    wikiTitle: 'Cockatiel',
    price: 300,
    size: 'Small',
    lengthCm: 'approx. 30 to 33 cm',
    lifespan: 'Often cited as 15 to 20+ years in human care',
    short: 'Gentle, whistling companion with an expressive crest.',
    description:
      'Cockatiels are a classic first parrot. They are gentle and sociable, love to whistle tunes, and communicate a lot through the angle of their crest.',
    temperament: ['Gentle', 'Sociable', 'Musical whistler', 'Beginner friendly'],
    diet: 'Pellets with a modest seed portion, greens and vegetables.',
    care: ['Horizontal space to move', 'Night light (prone to night frights)', 'Regular bathing or misting', 'Companionship'],
    accent: '#c9b26b',
    relatedAccessories: ['stainless-bowl-trio', 'premium-pellet-blend', 'grooming-kit'],
  },
  {
    id: 'eclectus-parrot',
    name: 'Eclectus Parrot',
    scientificName: 'Eclectus roratus (species group)',
    wikiTitle: 'Moluccan_eclectus',
    price: 1500,
    size: 'Large',
    lengthCm: 'approx. 35 to 42 cm',
    lifespan: 'Often cited as 30 to 50 years in human care',
    short: 'Dramatic colour difference: emerald males, crimson females.',
    description:
      'Eclectus parrots are known for the striking colour difference between the sexes. They tend to be calm, observant birds with a digestive system suited to a fresh, high-fibre diet.',
    temperament: ['Calm', 'Observant', 'Gentle', 'Thoughtful'],
    diet: 'High proportion of fresh vegetables and fruit; many avian vets advise caution with heavily fortified foods for this genus.',
    care: ['Fresh food prepared daily', 'Quiet, stable environment', 'Bathing', 'Gentle handling'],
    accent: '#16a34a',
    relatedAccessories: ['stainless-bowl-trio', 'foraging-puzzle-set', 'hardwood-play-stand'],
  },
  {
    id: 'indian-ringneck-parakeet',
    name: 'Indian Ringneck Parakeet',
    scientificName: 'Psittacula krameri manillensis',
    wikiTitle: 'Rose-ringed_parakeet',
    price: 700,
    size: 'Medium',
    lengthCm: 'approx. 40 cm including tail',
    lifespan: 'Often cited as 20 to 30 years in human care',
    short: 'Elegant long tail, crisp voice and an independent streak.',
    description:
      'Indian Ringnecks are sleek, athletic birds with long tails and clear speaking voices. They are clever and independent, and reward consistent, patient training.',
    temperament: ['Independent', 'Clever', 'Good talker', 'Energetic'],
    diet: 'Pellets with plenty of vegetables, some fruit and sprouted seeds.',
    care: ['Long cage for the tail', 'Consistent handling', 'Variety of perches', 'Foraging toys'],
    accent: '#22c55e',
    relatedAccessories: ['flight-cage-xl', 'foraging-puzzle-set', 'chew-toy-bundle'],
  },
]

export interface Accessory {
  id: string
  name: string
  category: 'Bird Cages' | 'Parrot Stands' | 'Bird Toys' | 'Premium Bird Food' | 'Feeding Bowls' | 'Grooming'
  price: number
  description: string
  icon: 'cage' | 'stand' | 'toy' | 'food' | 'bowl' | 'groom'
  tone: string
}

export const accessories: Accessory[] = [
  { id: 'flight-cage-xl', name: 'Rainforest Flight Cage XL', category: 'Bird Cages', price: 649, description: 'Powder-coated steel flight cage with a play top and slide-out trays.', icon: 'cage', tone: 'from-forest to-tropic' },
  { id: 'hardwood-play-stand', name: 'Hardwood Parrot Play Stand', category: 'Parrot Stands', price: 189, description: 'Natural java-wood stand with ladders, cups and a catch tray.', icon: 'stand', tone: 'from-[#7a4b25] to-[#b9844e]' },
  { id: 'chew-toy-bundle', name: 'Shred & Chew Toy Bundle', category: 'Bird Toys', price: 39, description: 'Six bird-safe wood, palm and paper toys for busy beaks.', icon: 'toy', tone: 'from-[#d7263d] to-gold' },
  { id: 'foraging-puzzle-set', name: 'Foraging Puzzle Set', category: 'Bird Toys', price: 54, description: 'Three-level foraging puzzles to keep clever minds engaged.', icon: 'toy', tone: 'from-[#2f7fc1] to-[#6fc3df]' },
  { id: 'premium-pellet-blend', name: 'Premium Pellet Blend', category: 'Premium Bird Food', price: 32, description: 'Sample nutrition blend with vegetables and fruit pieces.', icon: 'food', tone: 'from-gold to-[#f59e0b]' },
  { id: 'stainless-bowl-trio', name: 'Stainless Feeding Bowl Trio', category: 'Feeding Bowls', price: 24, description: 'Lock-on stainless bowls for food, fresh produce and water.', icon: 'bowl', tone: 'from-[#64748b] to-[#cbd5e1]' },
  { id: 'grooming-kit', name: 'Gentle Grooming Kit', category: 'Grooming', price: 29, description: 'Bathing mister, soft towel and perch-cleaning brush.', icon: 'groom', tone: 'from-tropic to-[#6ee7b7]' },
]

export const findParrot = (id: string) => parrots.find((p) => p.id === id)
export const findAccessory = (id: string) => accessories.find((a) => a.id === id)
export const findItem = (id: string) => findParrot(id) ?? findAccessory(id)

export const formatPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
