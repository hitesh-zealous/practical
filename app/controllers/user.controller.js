let Helper = require('../helpers/common.helper');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let libUser = require('../lib/lib.user');  

module.exports = {
  /**
   * Get user list.
   */
  list: async (req, res) => {
    try {
      let getAll = await libUser.list;
      console.log(getAll);
      if(getAll && getAll.length >0){
        Helper.respondAsJSON(res, "User list successfully.", getAll, true, 200);
      }else{
        Helper.respondAsJSON(res, "User list empty.", getAll, true, 200);
      }
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },

  /**
   * Create user with email, password and role.
   */
   create: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        Helper.handleError(res, 400, "Required inputs are invalid.", false, { error: errors.array() });
        return;
      }
      
      //check email
      let userData = await libUser.checkExists(req.body.email);
      if(!userData){
        Helper.handleError(res, 200, "Email already exits.");
        return;
      }

      //create user if not exist
      let createUser = await libUser.createUser(req.body);
      if(createUser){
        Helper.respondAsJSON(res, "User list successfully.", createUser, true, 200);
        return;
      }
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },
}
