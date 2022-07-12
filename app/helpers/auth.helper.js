'use strict';
let Helper = require('../helpers/common.helper');
const jwt = require('jsonwebtoken');

let libUser = require('../lib/lib.user');  

/**
 * Get authorization token from header
 */
function getAccessTokenFromHeader(req) {
  return (req.headers['authorization'] && req.headers['authorization'] !== null ? req.headers['authorization'].split(' ')[1] : null);
}

module.exports = {

  /**
   * Get Token from Request Header
   */
  getAccessToken: (req) => {
    return getAccessTokenFromHeader(req);
  },

  /*
  * Get UserData from JWT token.
  */
  getUserData: async (req, res, next) => {
    let tokenfromheader = getAccessTokenFromHeader(req);
    return jwt.verify(tokenfromheader, process.env.JWT_KEY);
  },

  /**
   * Check token is validate or not.
   */
  ensure: async (req, res, next) => {
    let tokenfromheader = getAccessTokenFromHeader(req);
    if (tokenfromheader === null) {
      Helper.handleError(res, 401, 'UnAthorize access.', false, {})
    } else {
      var userData = await libUser.getUserToken(tokenfromheader);
      if (userData) {
        next();
      } else {
        Helper.handleError(res, 401, 'UnAthorize access.', false, {})
      }
    }
  }

};
