async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'up1001', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log('Logged in successfully');

    const getRes = await fetch('http://localhost:5000/api/v1/violations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    const violations = getData.data;
    const reviewCases = violations.filter(v => v.status === 'OFFICER_REVIEW');
    
    if (reviewCases.length === 0) {
      console.log('No OFFICER_REVIEW cases found');
      return;
    }
    
    console.log(`Found ${reviewCases.length} cases to review. Attempting to discard: ${reviewCases[0].id}`);
    
    const updateRes = await fetch(`http://localhost:5000/api/v1/violations/${reviewCases[0].id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status: 'DISMISSED' })
    });
    
    const updateData = await updateRes.json();
    if (!updateRes.ok) {
      console.error('API Error:', updateRes.status, updateData);
    } else {
      console.log('Discard successful:', updateData);
    }
    
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}

test();
