const jwt = require('jsonwebtoken');
const config = require('../config');


function getIdFromToken(token) {
  const id = jwt.verify(token, config.jwtSecret);
  return id;
}

function createToken(id) {
  const payload = {
    sub: id
  };
  return jwt.sign(payload, config.jwtSecret);
}

exports.getIdFromToken = getIdFromToken;
exports.createToken = createToken;
