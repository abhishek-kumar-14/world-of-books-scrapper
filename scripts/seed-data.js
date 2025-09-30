// Sample seed data for development and testing
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-explorer';

async function seedData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🌱 Seeding sample data...');
    
    // Clear existing data
    await Promise.all([
      db.collection('navigations').deleteMany({}),
      db.collection('categories').deleteMany({}),
      db.collection('products').deleteMany({}),
      db.collection('productdetails').deleteMany({}),
      db.collection('reviews').deleteMany({})
    ]);
    
    // Seed navigation
    const navigation = await db.collection('navigations').insertMany([
      {
        title: 'Books',
        slug: 'books',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Fiction',
        slug: 'fiction',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Non-Fiction',
        slug: 'non-fiction',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Seed categories
    const categories = await db.collection('categories').insertMany([
      {
        navigationId: navigation.insertedIds[0],
        title: 'Science Fiction',
        slug: 'science-fiction',
        productCount: 150,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        navigationId: navigation.insertedIds[1],
        title: 'Mystery & Thriller',
        slug: 'mystery-thriller',
        productCount: 200,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        navigationId: navigation.insertedIds[2],
        title: 'Biography',
        slug: 'biography',
        productCount: 75,
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Seed products
    const products = await db.collection('products').insertMany([
      {
        sourceId: 'wob_dune_001',
        title: 'Dune',
        author: 'Frank Herbert',
        price: 12.99,
        currency: 'GBP',
        imageUrl: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',
        sourceUrl: 'https://www.worldofbooks.com/en-gb/books/frank-herbert/dune/9780441172719',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sourceId: 'wob_1984_002',
        title: '1984',
        author: 'George Orwell',
        price: 8.99,
        currency: 'GBP',
        imageUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
        sourceUrl: 'https://www.worldofbooks.com/en-gb/books/george-orwell/1984/9780141036144',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sourceId: 'wob_gatsby_003',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 7.99,
        currency: 'GBP',
        imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        sourceUrl: 'https://www.worldofbooks.com/en-gb/books/f-scott-fitzgerald/the-great-gatsby/9780141182636',
        lastScrapedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Seed product details
    await db.collection('productdetails').insertMany([
      {
        productId: products.insertedIds[0],
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
        ratingsAvg: 4.5,
        reviewsCount: 1250,
        publisher: 'Ace Books',
        publicationDate: new Date('1965-08-01'),
        isbn: '9780441172719',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: products.insertedIds[1],
        description: 'Winston Smith works for the Ministry of Truth in London, chief city of Airstrip One. Big Brother stares out from every poster, the Thought Police uncover every act of betrayal.',
        ratingsAvg: 4.3,
        reviewsCount: 2100,
        publisher: 'Penguin Classics',
        publicationDate: new Date('1949-06-08'),
        isbn: '9780141036144',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Seed reviews
    await db.collection('reviews').insertMany([
      {
        productId: products.insertedIds[0],
        author: 'BookLover123',
        rating: 5,
        text: 'An absolute masterpiece of science fiction. Herbert created an incredibly detailed and immersive world.',
        createdAt: new Date()
      },
      {
        productId: products.insertedIds[0],
        author: 'SciFiFan',
        rating: 4,
        text: 'Complex and rewarding read. Takes some time to get into but worth the effort.',
        createdAt: new Date()
      },
      {
        productId: products.insertedIds[1],
        author: 'ClassicReader',
        rating: 5,
        text: 'Chillingly relevant even today. Orwell\'s vision is both terrifying and brilliant.',
        createdAt: new Date()
      }
    ]);
    
    console.log('✅ Sample data seeded successfully!');
    console.log(`📚 ${navigation.insertedCount} navigation items`);
    console.log(`📂 ${categories.insertedCount} categories`);
    console.log(`📖 ${products.insertedCount} products`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData };