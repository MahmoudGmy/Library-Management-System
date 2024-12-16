const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authentication'] || req.headers['Authentication']; 
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication header missing" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = currentUser;

    console.log('Token verified:', currentUser);
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
