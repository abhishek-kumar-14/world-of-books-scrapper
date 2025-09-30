// MongoDB initialization script
db = db.getSiblingDB('product-explorer');

// Create collections with validation
db.createCollection('navigations', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'slug'],
      properties: {
        title: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        lastScrapedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('categories', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['navigationId', 'title', 'slug'],
      properties: {
        navigationId: { bsonType: 'objectId' },
        parentId: { bsonType: 'objectId' },
        title: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        productCount: { bsonType: 'number' },
        lastScrapedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['sourceId', 'title', 'price', 'currency', 'sourceUrl'],
      properties: {
        sourceId: { bsonType: 'string' },
        title: { bsonType: 'string' },
        author: { bsonType: 'string' },
        price: { bsonType: 'number' },
        currency: { bsonType: 'string' },
        imageUrl: { bsonType: 'string' },
        sourceUrl: { bsonType: 'string' },
        lastScrapedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes
db.navigations.createIndex({ slug: 1 }, { unique: true });
db.navigations.createIndex({ lastScrapedAt: 1 });

db.categories.createIndex({ navigationId: 1 });
db.categories.createIndex({ parentId: 1 });
db.categories.createIndex({ slug: 1 });
db.categories.createIndex({ navigationId: 1, slug: 1 }, { unique: true });

db.products.createIndex({ sourceId: 1 }, { unique: true });
db.products.createIndex({ sourceUrl: 1 }, { unique: true });
db.products.createIndex({ title: 'text', author: 'text' });
db.products.createIndex({ price: 1 });
db.products.createIndex({ lastScrapedAt: 1 });

print('Database initialized successfully!');