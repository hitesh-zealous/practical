'use strict';

const bcrypt  = require('bcrypt');
var connection  = require('./db');

module.exports = {
  list: async () => {
    try {
      connection.query( `SELECT * FROM users ORDER BY id desc`, (err, results) => {
        if (err) throw err;
        return results;
      });
    } catch (Error) {
      return false;
    }
  },

  checkExists: async (email) => {
    return new Promise((resolve, reject) => {
      connection.query( `SELECT * FROM users WHERE email = '${email}'`, (err, results) => {
        // console.log(result.sql); return false;
          if(err) {
              reject(err);
          } else {
            if(results && results.length > 0){
              resolve(false);
            }else{
              resolve(true);
            }
          } 
      });
    });
  },

  createUser: async (allParam) => {
    return new Promise((resolve, reject) => {
      var valuesinsert = {email, password, role} = allParam;
      password = bcrypt.hashSync(password, 10);

      var sqlinsert = "INSERT INTO users SET ?";
      connection.query(sqlinsert, valuesinsert, (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  }
}