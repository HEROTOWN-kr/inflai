const jwt = require('jsonwebtoken');
const config = require('../config')


function getIdFromToken(token) {
  const id = jwt.verify(token, config.jwtSecret);
  return id;
}

exports.getIdFromToken = getIdFromToken;
