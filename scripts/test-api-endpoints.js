// Test script to debug API endpoints
async function testAPIEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   ✅ Health: ${healthData.status}`);
    } else {
      console.log(`   ❌ Health check failed`);
    }

    // Test 2: Navigation
    console.log('\n2. Testing navigation endpoint...');
    const navResponse = await fetch(`${baseUrl}/navigation`);
    console.log(`   Status: ${navResponse.status}`);
    if (navResponse.ok) {
      const navData = await navResponse.json();
      console.log(`   ✅ Navigation items: ${navData.length}`);
      if (navData.length > 0) {
        console.log(`   First item: ${navData[0].title} (${navData[0].slug})`);
      }
    } else {
      console.log(`   ❌ Navigation failed`);
    }

    // Test 3: Categories list
    console.log('\n3. Testing categories list endpoint...');
    const categoriesResponse = await fetch(`${baseUrl}/categories`);
    console.log(`   Status: ${categoriesResponse.status}`);
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log(`   ✅ Categories: ${categoriesData.data ? categoriesData.data.length : 'No data property'}`);
    } else {
      console.log(`   ❌ Categories list failed`);
    }

    // Test 4: Specific category
    console.log('\n4. Testing specific category endpoint...');
    const categoryResponse = await fetch(`${baseUrl}/categories/adventure`);
    console.log(`   Status: ${categoryResponse.status}`);
    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      console.log(`   ✅ Category data:`, categoryData);
    } else {
      const errorText = await categoryResponse.text();
      console.log(`   ❌ Category failed: ${errorText}`);
    }

    // Test 5: Products
    console.log('\n5. Testing products endpoint...');
    const productsResponse = await fetch(`${baseUrl}/products`);
    console.log(`   Status: ${productsResponse.status}`);
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log(`   ✅ Products: ${productsData.data ? productsData.data.length : 'No data property'}`);
    } else {
      console.log(`   ❌ Products failed`);
    }

  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

// Run the test
testAPIEndpoints();