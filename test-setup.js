// Test script for the setup endpoint
const testSetup = async () => {
  try {
    console.log('Testing setup endpoint...');
    
    const response = await fetch('http://localhost:3000/api/auth/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'System Administrator',
        email: 'admin@company.com',
        password: 'password123'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Setup successful!');
      console.log('Response:', data);
    } else {
      console.log('❌ Setup failed:');
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// Run the test
testSetup();
