// Test script to trigger real scraping using built-in fetch
async function triggerRealScraping() {
  console.log('🚀 Triggering REAL World of Books scraping...\n');

  try {
    // 1. Test health endpoint
    console.log('1. Testing backend health...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend status:', healthData.status);

    // 2. Trigger navigation scraping
    console.log('\n2. Triggering navigation scraping...');
    const scrapeResponse = await fetch('http://localhost:3001/scraping/navigation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!scrapeResponse.ok) {
      throw new Error(`Scraping failed: ${scrapeResponse.status} ${scrapeResponse.statusText}`);
    }
    
    const scrapeData = await scrapeResponse.json();
    console.log('✅ Scraping job started:', scrapeData);

    // 3. Wait a bit and check job status
    console.log('\n3. Waiting 15 seconds for scraping to complete...');
    await new Promise(resolve => setTimeout(resolve, 15000));

    // 4. Check if new data was scraped
    console.log('\n4. Checking for updated navigation data...');
    const navResponse = await fetch('http://localhost:3001/navigation');
    const navData = await navResponse.json();
    
    console.log(`✅ Found ${navData.length} navigation items:`);
    navData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title} (${item.slug})`);
      console.log(`      Last scraped: ${new Date(item.lastScrapedAt).toLocaleString()}`);
    });

    // 5. Check products
    console.log('\n5. Checking for products...');
    const productsResponse = await fetch('http://localhost:3001/products');
    const productsData = await productsResponse.json();
    console.log(`✅ Found ${productsData.data.length} products`);

    console.log('\n🎉 Scraping test completed!');
    console.log('\n📝 Next steps:');
    console.log('   - Refresh your frontend (http://localhost:3000)');
    console.log('   - Check if categories now show real data');
    console.log('   - Monitor your backend terminal for scraping logs');

  } catch (error) {
    console.error('❌ Error during scraping test:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure your backend is running on port 3001');
    console.log('   - Check backend terminal for error messages');
    console.log('   - Verify scraping endpoints are available');
  }
}

// Run the test
triggerRealScraping();