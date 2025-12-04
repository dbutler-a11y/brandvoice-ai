import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const spokespersons = [
  {
    name: 'Sarah',
    displayName: 'Sarah - The Beauty Expert',
    description: 'Warm, sophisticated, and knowledgeable about all things beauty and wellness. Sarah brings an air of luxury and trust to med spa and aesthetics businesses.',
    primaryNiche: 'Med Spa / Aesthetics',
    secondaryNiches: 'Skincare, Wellness, Cosmetic Surgery, Dermatology',
    tone: 'Luxury, Sophisticated, Reassuring',
    personality: 'Warm, Professional, Knowledgeable, Confident',
    ageRange: '32-38',
    gender: 'Female',
    hairOptions: JSON.stringify(['Brunette', 'Blonde Highlights', 'Dark Brown']),
    clothingOptions: JSON.stringify(['White Lab Coat', 'Elegant Blouse', 'Professional Dress']),
    backgroundOptions: JSON.stringify(['Modern Spa Interior', 'Clean Clinical Setting', 'Luxe Reception Area']),
    voiceStyle: 'Warm and articulate, with a calm, reassuring tone',
    accentOptions: JSON.stringify(['American Neutral', 'Soft Southern', 'California']),
    tier: 'premium',
    basePrice: 149700,
    isAvailable: true,
    featured: true,
    sortOrder: 1
  },
  {
    name: 'Marcus',
    displayName: 'Marcus - Your Trusted Real Estate Guide',
    description: 'Clean-cut and trustworthy with a warm, approachable demeanor. Marcus excels at making complex real estate topics feel simple and building instant credibility.',
    primaryNiche: 'Real Estate',
    secondaryNiches: 'Property Management, Mortgage, Home Services, Insurance',
    tone: 'Trustworthy, Approachable, Knowledgeable',
    personality: 'Genuine, Patient, Confident, Down-to-earth',
    ageRange: '38-45',
    gender: 'Male',
    hairOptions: JSON.stringify(['Salt-and-Pepper', 'Dark Brown', 'Gray']),
    clothingOptions: JSON.stringify(['Navy Blazer', 'Oxford Shirt', 'Charcoal Suit']),
    backgroundOptions: JSON.stringify(['Modern Office', 'Home Interior', 'Neighborhood Street']),
    voiceStyle: 'Warm baritone, confident but not pushy, conversational pace',
    accentOptions: JSON.stringify(['American Neutral', 'Midwestern', 'East Coast']),
    tier: 'premium',
    basePrice: 149700,
    isAvailable: true,
    featured: true,
    sortOrder: 2
  },
  {
    name: 'Jessica',
    displayName: 'Jessica - The Fitness Motivator',
    description: 'High-energy and inspiring, Jessica brings passion and authenticity to fitness and wellness brands. She motivates viewers to take action.',
    primaryNiche: 'Fitness / Gym',
    secondaryNiches: 'Personal Training, Nutrition, Wellness Coaching, Sports',
    tone: 'Energetic, Motivating, Authentic',
    personality: 'Enthusiastic, Supportive, Driven, Relatable',
    ageRange: '28-35',
    gender: 'Female',
    hairOptions: JSON.stringify(['Ponytail Blonde', 'Athletic Bun', 'Loose Brown']),
    clothingOptions: JSON.stringify(['Athletic Wear', 'Gym Tank', 'Casual Sporty']),
    backgroundOptions: JSON.stringify(['Modern Gym', 'Outdoor Park', 'Home Gym']),
    voiceStyle: 'Upbeat and dynamic, with natural enthusiasm',
    accentOptions: JSON.stringify(['American Neutral', 'California', 'Athletic']),
    tier: 'standard',
    basePrice: 99700,
    isAvailable: true,
    featured: false,
    sortOrder: 3
  },
  {
    name: 'David',
    displayName: 'David - The Legal Authority',
    description: 'Polished and authoritative, David conveys expertise and trustworthiness for law firms and professional services. He simplifies complex legal concepts.',
    primaryNiche: 'Legal / Law Firm',
    secondaryNiches: 'Financial Services, Consulting, B2B Professional Services',
    tone: 'Authoritative, Professional, Reassuring',
    personality: 'Confident, Articulate, Trustworthy, Measured',
    ageRange: '45-55',
    gender: 'Male',
    hairOptions: JSON.stringify(['Gray', 'Silver', 'Distinguished Gray']),
    clothingOptions: JSON.stringify(['Navy Suit', 'Charcoal Suit', 'Professional Tie']),
    backgroundOptions: JSON.stringify(['Law Library', 'Executive Office', 'Conference Room']),
    voiceStyle: 'Measured and authoritative, with gravitas',
    accentOptions: JSON.stringify(['American Neutral', 'East Coast', 'Professional']),
    tier: 'premium',
    basePrice: 149700,
    isAvailable: true,
    featured: false,
    sortOrder: 4
  },
  {
    name: 'Elena',
    displayName: 'Elena - The Culinary Host',
    description: 'Warm and inviting with Mediterranean charm, Elena is perfect for restaurants, food brands, and hospitality businesses. She makes viewers feel welcome.',
    primaryNiche: 'Restaurant / Food Service',
    secondaryNiches: 'Hospitality, Catering, Food Products, Wine/Beverage',
    tone: 'Warm, Inviting, Passionate',
    personality: 'Welcoming, Enthusiastic, Genuine, Charming',
    ageRange: '35-45',
    gender: 'Female',
    hairOptions: JSON.stringify(['Dark Wavy', 'Brunette', 'Mediterranean']),
    clothingOptions: JSON.stringify(['Chef Coat', 'Elegant Casual', 'Restaurant Host Attire']),
    backgroundOptions: JSON.stringify(['Restaurant Interior', 'Kitchen', 'Outdoor Patio']),
    voiceStyle: 'Warm and inviting, with subtle passion',
    accentOptions: JSON.stringify(['American Neutral', 'Slight European', 'Mediterranean']),
    tier: 'standard',
    basePrice: 99700,
    isAvailable: true,
    featured: false,
    sortOrder: 5
  },
  {
    name: 'Alex',
    displayName: 'Alex - The Tech Innovator',
    description: 'Modern and approachable, Alex translates complex tech concepts into simple terms. Perfect for SaaS, startups, and technology companies.',
    primaryNiche: 'Technology / SaaS',
    secondaryNiches: 'Startups, Software, IT Services, Digital Products',
    tone: 'Modern, Clear, Innovative',
    personality: 'Smart, Approachable, Forward-thinking, Articulate',
    ageRange: '30-38',
    gender: 'Non-binary',
    hairOptions: JSON.stringify(['Modern Cut', 'Professional', 'Tech Casual']),
    clothingOptions: JSON.stringify(['Smart Casual', 'Tech Hoodie', 'Business Casual']),
    backgroundOptions: JSON.stringify(['Modern Office', 'Startup Space', 'Clean Minimal']),
    voiceStyle: 'Clear and articulate, with modern energy',
    accentOptions: JSON.stringify(['American Neutral', 'West Coast', 'International']),
    tier: 'standard',
    basePrice: 99700,
    isAvailable: true,
    featured: false,
    sortOrder: 6
  }
]

async function main() {
  console.log('🌱 Seeding spokespersons...')

  for (const spokesperson of spokespersons) {
    const existing = await prisma.spokesperson.findFirst({
      where: { name: spokesperson.name }
    })

    if (existing) {
      console.log(`  ⏭️  Skipping ${spokesperson.name} (already exists)`)
      continue
    }

    await prisma.spokesperson.create({
      data: spokesperson
    })
    console.log(`  ✅ Created ${spokesperson.displayName}`)
  }

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
