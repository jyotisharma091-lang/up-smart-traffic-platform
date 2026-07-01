async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '9454400249', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
        console.error('Login failed', loginData);
        return;
    }
    const token = loginData.data.token;
    console.log('Logged in successfully');

    const getRes = await fetch('http://localhost:5000/api/v1/violations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    const violations = getData.data;
    console.log('Total violations returned:', violations?.length);
    
    if (violations) {
      const verificationQueue = violations.filter(v => v.status === 'VERIFICATION_QUEUE');
      console.log('VERIFICATION_QUEUE count:', verificationQueue.length);
    } else {
      console.log('Error data:', getData);
    }
    
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}
test();
