const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  try {
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw new Error('Token generation failed');
  }
};

module.exports = generateToken;
