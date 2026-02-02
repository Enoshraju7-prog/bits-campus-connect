import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INTERESTS = [
  // Sports
  { name: 'Cricket', category: 'Sports', icon: 'trophy' },
  { name: 'Football', category: 'Sports', icon: 'trophy' },
  { name: 'Basketball', category: 'Sports', icon: 'trophy' },
  { name: 'Badminton', category: 'Sports', icon: 'trophy' },
  { name: 'Tennis', category: 'Sports', icon: 'trophy' },
  { name: 'Table Tennis', category: 'Sports', icon: 'trophy' },
  { name: 'Chess', category: 'Sports', icon: 'trophy' },
  { name: 'Swimming', category: 'Sports', icon: 'trophy' },
  { name: 'Athletics', category: 'Sports', icon: 'trophy' },
  { name: 'Volleyball', category: 'Sports', icon: 'trophy' },

  // Technology
  { name: 'Web Development', category: 'Technology', icon: 'code' },
  { name: 'Mobile Development', category: 'Technology', icon: 'code' },
  { name: 'AI/ML', category: 'Technology', icon: 'code' },
  { name: 'Data Science', category: 'Technology', icon: 'code' },
  { name: 'Cybersecurity', category: 'Technology', icon: 'code' },
  { name: 'Blockchain', category: 'Technology', icon: 'code' },
  { name: 'Cloud Computing', category: 'Technology', icon: 'code' },
  { name: 'DevOps', category: 'Technology', icon: 'code' },
  { name: 'IoT', category: 'Technology', icon: 'code' },

  // Finance
  { name: 'Stock Trading', category: 'Finance', icon: 'trending-up' },
  { name: 'Crypto', category: 'Finance', icon: 'trending-up' },
  { name: 'Personal Finance', category: 'Finance', icon: 'trending-up' },
  { name: 'Quant Finance', category: 'Finance', icon: 'trending-up' },
  { name: 'Investing', category: 'Finance', icon: 'trending-up' },
  { name: 'Economics', category: 'Finance', icon: 'trending-up' },

  // Arts & Entertainment
  { name: 'Music', category: 'Arts & Entertainment', icon: 'music' },
  { name: 'Dance', category: 'Arts & Entertainment', icon: 'music' },
  { name: 'Photography', category: 'Arts & Entertainment', icon: 'camera' },
  { name: 'Videography', category: 'Arts & Entertainment', icon: 'camera' },
  { name: 'Film Making', category: 'Arts & Entertainment', icon: 'film' },
  { name: 'Short Films', category: 'Arts & Entertainment', icon: 'film' },
  { name: 'Writing', category: 'Arts & Entertainment', icon: 'pen-tool' },
  { name: 'Poetry', category: 'Arts & Entertainment', icon: 'pen-tool' },
  { name: 'Stand-up Comedy', category: 'Arts & Entertainment', icon: 'smile' },
  { name: 'Theatre', category: 'Arts & Entertainment', icon: 'smile' },

  // Gaming
  { name: 'PC Gaming', category: 'Gaming', icon: 'gamepad-2' },
  { name: 'Mobile Gaming', category: 'Gaming', icon: 'gamepad-2' },
  { name: 'Console Gaming', category: 'Gaming', icon: 'gamepad-2' },
  { name: 'Esports', category: 'Gaming', icon: 'gamepad-2' },
  { name: 'Game Development', category: 'Gaming', icon: 'gamepad-2' },

  // Academics
  { name: 'Research', category: 'Academics', icon: 'book-open' },
  { name: 'Competitive Programming', category: 'Academics', icon: 'book-open' },
  { name: 'Robotics', category: 'Academics', icon: 'book-open' },
  { name: 'Electronics', category: 'Academics', icon: 'book-open' },
  { name: 'Mathematics', category: 'Academics', icon: 'book-open' },
  { name: 'Physics', category: 'Academics', icon: 'book-open' },

  // Lifestyle
  { name: 'Fitness', category: 'Lifestyle', icon: 'heart' },
  { name: 'Travel', category: 'Lifestyle', icon: 'map-pin' },
  { name: 'Food', category: 'Lifestyle', icon: 'utensils' },
  { name: 'Reading', category: 'Lifestyle', icon: 'book' },
  { name: 'Anime', category: 'Lifestyle', icon: 'tv' },
  { name: 'Movies', category: 'Lifestyle', icon: 'tv' },
  { name: 'TV Series', category: 'Lifestyle', icon: 'tv' },
  { name: 'Fashion', category: 'Lifestyle', icon: 'shirt' },
  { name: 'Cooking', category: 'Lifestyle', icon: 'utensils' },

  // Social Impact
  { name: 'Environment', category: 'Social Impact', icon: 'leaf' },
  { name: 'Education', category: 'Social Impact', icon: 'graduation-cap' },
  { name: 'Social Entrepreneurship', category: 'Social Impact', icon: 'users' },
  { name: 'Volunteering', category: 'Social Impact', icon: 'hand-helping' },
];

const DEFAULT_COMMUNITIES = [
  // Campus-specific
  { name: 'BITS Pilani', description: 'Official community for BITS Pilani campus students', isPrivate: false },
  { name: 'BITS Goa', description: 'Official community for BITS Goa campus students', isPrivate: false },
  { name: 'BITS Hyderabad', description: 'Official community for BITS Hyderabad campus students', isPrivate: false },
  { name: 'BITS Dubai', description: 'Official community for BITS Dubai campus students', isPrivate: false },

  // Interest-based
  { name: 'Cricket Club', description: 'For cricket enthusiasts across all campuses', isPrivate: false },
  { name: 'Stock Traders', description: 'Discuss stocks, markets, and trading strategies', isPrivate: false },
  { name: 'Coding & DSA', description: 'Data structures, algorithms, and competitive programming', isPrivate: false },
  { name: 'Placement Prep', description: 'Placement preparation, interview tips, and experiences', isPrivate: false },
  { name: 'Music Lovers', description: 'Share and discover music across genres', isPrivate: false },
  { name: 'Filmmakers', description: 'Short films, videography, and cinema discussion', isPrivate: false },
  { name: 'Fitness Freaks', description: 'Workout routines, nutrition, and fitness goals', isPrivate: false },
  { name: 'Anime & Manga', description: 'Discuss anime, manga, and Japanese culture', isPrivate: false },
  { name: 'Memes', description: 'The best memes from across BITS campuses', isPrivate: false },
  { name: 'Tech News', description: 'Latest in technology, startups, and innovation', isPrivate: false },
  { name: 'Startups', description: 'Entrepreneurship, startup ideas, and building products', isPrivate: false },
  { name: 'Research Papers', description: 'Share and discuss academic research papers', isPrivate: false },
  { name: 'Gaming Zone', description: 'PC, console, and mobile gaming community', isPrivate: false },
  { name: 'Photography', description: 'Share photos, tips, and photography techniques', isPrivate: false },
  { name: 'Travel Stories', description: 'Travel experiences, tips, and trip planning', isPrivate: false },
];

async function main() {
  console.log('Seeding interests...');
  for (const interest of INTERESTS) {
    await prisma.interest.upsert({
      where: { name: interest.name },
      update: {},
      create: interest,
    });
  }
  console.log(`Seeded ${INTERESTS.length} interests`);

  // Create a system user for seeding communities
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@pilani.bits-pilani.ac.in' },
    update: {},
    create: {
      email: 'system@pilani.bits-pilani.ac.in',
      username: 'system',
      passwordHash: 'system-account-no-login',
      name: 'BITS Campus Connect',
      campus: 'pilani',
      batchYear: 2020,
      isVerified: true,
    },
  });

  console.log('Seeding communities...');
  for (const community of DEFAULT_COMMUNITIES) {
    await prisma.community.upsert({
      where: { name: community.name },
      update: {},
      create: {
        ...community,
        createdBy: systemUser.id,
      },
    });
  }
  console.log(`Seeded ${DEFAULT_COMMUNITIES.length} communities`);

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
