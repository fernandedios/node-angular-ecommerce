const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secret');

module.exports = function(req, res, next) {
  let token = req.headers['authorization'];

  if(token) {
    jwt.verify(token, secretKey, function(err, decoded) {
      if(err) {
        res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
};
