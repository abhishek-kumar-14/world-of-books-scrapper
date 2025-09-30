// Test script to check scraping functionality
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';

async function testScrapingEndpoints() {
  console.log('🧪 Testing scraping endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test navigation endpoint
    console.log('\n2. Testing navigation endpoint...');
    const navResponse = await fetch(`${API_BASE}/navigation`);
    const navData = await navResponse.json();
    console.log(`✅ Navigation items found: ${navData.length}`);

    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await fetch(`${API_BASE}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log(`✅ Categories found: ${categoriesData.data.length}`);

    // Test products endpoint
    console.log('\n4. Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    console.log(`✅ Products found: ${productsData.data.length}`);

    // Test search endpoint
    console.log('\n5. Testing search endpoint...');
    const searchResponse = await fetch(`${API_BASE}/search?q=dune`);
    const searchData = await searchResponse.json();
    console.log(`✅ Search results for "dune": ${searchData.data.length}`);

    // Test scraping trigger (navigation)
    console.log('\n6. Testing navigation scraping trigger...');
    const scrapeResponse = await fetch(`${API_BASE}/navigation/scrape`, {
      method: 'POST'
    });
    const scrapeData = await scrapeResponse.json();
    console.log(`✅ Scraping job queued: ${scrapeData.jobId}`);

    console.log('\n🎉 All endpoints are working correctly!');
    console.log('\n📝 Next steps:');
    console.log('   - Refresh your frontend (http://localhost:3000)');
    console.log('   - Check API docs (http://localhost:3001/api/docs)');
    console.log('   - Monitor scraping jobs in your backend logs');

  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure your backend is running on port 3001');
    console.log('   - Check if MongoDB is running');
    console.log('   - Verify your .env configuration');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testScrapingEndpoints();
}

module.exports = { testScrapingEndpoints };