'use strict';

const bcrypt  = require('bcrypt');
var connection  = require('./db');
let Helper = require('../helpers/common.helper');



module.exports = {
  list: async (withfilter="", res) => {
  

      var sql = "SELECT * FROM users ORDER BY id desc";
      if(withfilter != ""){
        sql = `SELECT * FROM users ORDER BY ${withfilter}`;
      }
     
      const data = await connection.promise().query(sql);
      console.log({data});
      return data[0];

    //  var data = await connection.promise().query(sql,function (err, rows, fields) {
    //     if (err) throw err;

    //     data = rows;           
            
        
    // }); 
    // return data;
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

  checkExistsWithId: async (email,id) => {
    return new Promise((resolve, reject) => {
      connection.query( 'SELECT * FROM users WHERE email = ? AND id != ?', [email,id] ,(err, results) => {
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
      let { email, password, role, name, contact } = allParam;
      password = bcrypt.hashSync(password, 10);

      var valuesinsert = { email, password, role, name, contact };
      connection.query(`INSERT INTO users SET ?`, valuesinsert, (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },
  
  getUserById: async (id) => {
    return new Promise((resolve, reject) => {
      connection.query( `SELECT * FROM users WHERE id = '${id}'`, (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },

  getUserByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      connection.query( `SELECT * FROM users WHERE email = '${email}'`, (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },

  updateUser: async (id,allParam) => {
    return new Promise((resolve, reject) => {
      let { email, name, contact } = allParam;
      var valuesinsert = { email, name, contact };
      connection.query(`UPDATE users SET ? WHERE id = ?`, [valuesinsert,id], (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },

  deleteUser: async (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },

  getUserToken: async (token) => {
    return new Promise((resolve, reject) => {
      connection.query( 'SELECT * FROM users WHERE token = ?',[token], (err, results) => {
          if(err) {
              reject(err);
          } else {
            if(results && results.length > 0){
              resolve(results);
            }else{
              resolve(false);
            }
          } 
      });
    });
  },

  updateToken: async (id,token) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET token = ? WHERE id = ?`, [token,id], (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },

  updateProfile: async (id,image) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET image = ? WHERE id = ?`, [image,id], (err, results) => {
          if(err) {
            reject(err);
          } else {
            resolve(results);
          } 
      });
    });
  },

}
