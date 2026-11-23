import fetch from 'node-fetch';

async function testAPI() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3003/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    // Test user registration
    console.log('\nTesting user registration...');
    const registerResponse = await fetch('http://localhost:3003/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })
    });
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);

    // Test login
    console.log('\nTesting login...');
    const loginResponse = await fetch('http://localhost:3003/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginData.data && loginData.data.accessToken) {
      const token = loginData.data.accessToken;

      // Test get current user
      console.log('\nTesting get current user...');
      const userResponse = await fetch('http://localhost:3003/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await userResponse.json();
      console.log('Current user:', userData);

      // Test get projects
      console.log('\nTesting get projects...');
      const projectsResponse = await fetch('http://localhost:3003/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const projectsData = await projectsResponse.json();
      console.log('Projects:', projectsData);
    }

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();