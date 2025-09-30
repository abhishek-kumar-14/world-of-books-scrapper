// Script to trigger real category scraping for specific categories
async function triggerCategoryScraping() {
  console.log('🕷️ Triggering REAL category scraping...\n');

  const baseUrl = 'http://localhost:3001';
  const categories = ['adventure', 'fiction', 'books', 'childrens-books'];
  
  try {
    // Test backend health first
    console.log('1. Testing backend health...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    if (!healthResponse.ok) {
      throw new Error('Backend is not running');
    }
    console.log('✅ Backend is healthy');

    // Trigger scraping for each category
    for (const category of categories) {
      console.log(`\n2. Triggering scraping for category: ${category}`);
      
      try {
        const scrapeResponse = await fetch(`${baseUrl}/scraping/category/${category}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (scrapeResponse.ok) {
          const scrapeData = await scrapeResponse.json();
          console.log(`✅ Scraping job queued for ${category}:`, scrapeData.jobId);
        } else {
          console.log(`⚠️ Scraping failed for ${category}: ${scrapeResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Error scraping ${category}: ${error.message}`);
      }
      
      // Wait 2 seconds between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n3. Waiting 30 seconds for scraping to complete...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Check results
    console.log('\n4. Checking scraped products...');
    const productsResponse = await fetch(`${baseUrl}/products?limit=50`);
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log(`✅ Total products in database: ${productsData.data.length}`);
      
      // Show some product titles
      const realProducts = productsData.data.filter(p => !p.title.includes('Book 1') && !p.title.includes('Book 2'));
      console.log(`📚 Real scraped products: ${realProducts.length}`);
      
      if (realProducts.length > 0) {
        console.log('Sample real products:');
        realProducts.slice(0, 5).forEach((product, i) => {
          console.log(`   ${i + 1}. ${product.title} by ${product.author || 'Unknown'} - £${product.price}`);
        });
      }
    }

    console.log('\n🎉 Scraping process completed!');
    console.log('\n📝 Next steps:');
    console.log('   - Refresh your browser: http://localhost:3000/categories/adventure');
    console.log('   - Check other categories: http://localhost:3000/categories/fiction');
    console.log('   - Try search: http://localhost:3000/search');

  } catch (error) {
    console.error('❌ Error during scraping process:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure your backend is running on port 3001');
    console.log('   - Check backend terminal for error messages');
    console.log('   - Verify scraping endpoints are working');
  }
}

// Run the scraping
triggerCategoryScraping();