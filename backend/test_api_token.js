require('dotenv').config();
const jwt = require('jsonwebtoken');

async function test() {
  const payload = {
    id: '990ee0e4-6544-4647-9ce5-c5ff84e7aa73',
    role: 'DISTRICT_ADMIN',
    district: 'Kanpur nagar',
    isFirstLogin: false
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  try {
    const getRes = await fetch('http://localhost:5000/api/v1/violations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    console.log('Total violations returned:', getData.data?.length);
    if (getData.data) {
      const verificationQueue = getData.data.filter(v => v.status === 'VERIFICATION_QUEUE');
      console.log('VERIFICATION_QUEUE count:', verificationQueue.length);
    } else {
      console.log('Error data:', getData);
    }
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}
test();
