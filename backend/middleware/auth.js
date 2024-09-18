const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(403).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

module.exports = authenticate;
