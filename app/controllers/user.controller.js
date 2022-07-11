var connection  = require('../lib/db');
let Helper = require('../helpers/common.helper');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {

  /**
   * Get user list.
   */
  list: async (req, res) => {
    try {
        connection.query('SELECT * FROM users ORDER BY id desc',function (err, result, fields) {
          if (err) throw err;
          Helper.respondAsJSON(res, "User list successfully.", result, true, 200);
        });
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

      // console.log({gg:req.body});
//  return false;
      let email = req.body.email;
      let password = bcrypt.hashSync(req.body.password, 10);
      let role = req.body.role;

      let userData = await _createUser(req.body);
      if(!userData){
        Helper.handleError(res, 200, "Email already exits.");
        return;
      }


      var sqlinsert = "INSERT INTO users (email, password, role) VALUES ?";
      var valuesinsert = [
        [email, password, role]
      ];
      connection.query(sqlinsert, [valuesinsert],function (err, result, fields) {
        if (err) throw err;
        
        connection.query('SELECT * FROM users ORDER BY id desc',function (err, result, fields) {
          if (err) throw err;
          Helper.respondAsJSON(res, "User created successfully.", result, true, 200);
        });
      });

    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },
}


async function _createUser(data){
  var sql = `SELECT * FROM users WHERE email = '${data.email}'`;
  connection.query(sql,function (err, result, fields) {
    if (err) throw err;
    if(result && result.length > 0){
      return false;
    }else{
      return true;
    }
  });
  
}