let User = require('../models/user.model');
let Helper = require('../helpers/common.helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

module.exports = {

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

      let email = req.body.email;
      let password = bcrypt.hashSync(req.body.password, 10);
      let role = req.body.role;

      let isExits = await User.findOne({ email });
      if (isExits) {
        Helper.handleError(res, 200, "Email already exits.");
        return;
      }

      let userData = await User.create({ email, password, role });
      Helper.respondAsJSON(res, "User created successfully.", userData, true, 200);

    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },

  /*
  Login user using email and password combination
  */
  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        Helper.handleError(res, 400, "Required inputs are invalid.", false, { error: errors.array() });
        return;
      }

      let email = req.body.email;
      let password = req.body.password;

      //validate email address.
      let userData = await User.findOne({ email });
      if (!userData) {
        Helper.handleError(res, 401, "Email not found.");
        return;
      }

      let isMatch = bcrypt.compareSync(password, userData.password);
      if (isMatch) {
        //ismatch true then return with JWT token store as well in database.
        let token = jwt.sign({
          _id: userData._id,
          email: userData.email,
          role: userData.role
        }, process.env.JWT_KEY);
        userData.token = token;
        userData.save();
        Helper.respondAsJSON(res, "User created successfully.", userData, true, 200);
        return;
      } else {
        Helper.handleError(res, 401, "User not found with email/password combination.");
        return;
      }
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  }
};