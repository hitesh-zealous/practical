let Helper = require('../helpers/common.helper');
let Auth = require('../helpers/auth.helper');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");

let libUser = require('../lib/lib.user'); 

async function isImage(files){
  if (files !== null) {
    let extension = files.originalname.split('.').pop();
    switch (extension) {
        case 'jpg':
            return true;
        case 'jpeg':
            return true;
        case 'png':
            return true;
        default:
            return false;
    }
  } else return false;
}

module.exports = {

  /**
   * Do user login.
   */
   login: async (req, res) => {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        Helper.handleError(res, 400, "Required inputs are invalid.", false, { error: errors.array() });
        return;
      }

      let email = req.body.email;
      let password = req.body.password;

      //validate email address.
      let userData = await libUser.getUserByEmail(email);
      if (!userData) {
        Helper.handleError(res, 401, "Email not found.");
        return;
      }

      userData = userData[0];

      let isMatch = bcrypt.compareSync(password, userData.password);
      if (isMatch) {
       
        let token = jwt.sign({
          id: userData.id,
          email: userData.email,
          role: userData.role
        }, process.env.JWT_KEY);

        let updateT = await libUser.updateToken(userData.id,token); 
        if(updateT){
          var returnData = await libUser.getUserById(userData.id);
          Helper.respondAsJSON(res, "User login successfully.", returnData, true, 200);
          return;
        }else{
          Helper.handleError(res);
        }
      } else {
        Helper.handleError(res, 401, "User not found with email/password combination.");
        return;
      }
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },

  /**
   * user image update.
   */
   list: async (req, res) => {
    try {
      var withfilter = "";
      var {sort_by ,page ,limit } = req.query;
      if(sort_by != undefined && sort_by != ""){ withfilter = sort_by.replace(".", " "); }
      if(page != undefined && page != ""){ 
        limit = limit ? limit : 1; 
        var offset = limit * page; 
        var makepage = " LIMIT "+limit+" OFFSET "+offset; 
        withfilter = withfilter+makepage;
      }

      let getAll = await libUser.list(withfilter);
      if(getAll && getAll.length >0){
        Helper.respondAsJSON(res, "User list successfully.", getAll, true, 200);
      }else{
        Helper.respondAsJSON(res, "User list empty.", getAll, true, 200);
      }
    } catch (Error) {
      if(Error && Error.errno && Error.errno == "1054"){
        Helper.handleError(res,500,"Column not found");
      }else{
        Helper.handleError(res);
      }
      return;
    }
  },

  /**
   * Get user list.
   */
   uploadimage: async (req, res) => {
    try {
      let file = req.file;
      var checkImage = await isImage(file);
      if (!checkImage){
        Helper.handleError(res, 401, "Image type only jpg,jpeg and png allowed");
        return false;
      }

      var gettokenuser = await Auth.getAccessToken(req);
      if(!gettokenuser){
        Helper.handleError(res, 401, "Token not found");
        return false;
      }

      let userData = await libUser.getUserToken(gettokenuser);
      if(!userData){
        Helper.handleError(res, 200, "User not found");
        return;
      }
      

      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads')
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
      })
      var upload = multer({ storage: storage });
      if(upload){
        var dbfilename = '/public/data/uploads/'+file.filename;
        //update user profile
        let updateUser = libUser.updateProfile(userData[0].id,dbfilename);
        if(updateUser){
          userData[0].image = dbfilename;
          Helper.respondAsJSON(res, "User profile updated successfully.", userData, true, 200);
          return;
        }
      }

    } catch (Error) {
      console.log(">",Error);
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
        var returnData = await libUser.getUserById(createUser.insertId);
        Helper.respondAsJSON(res, "User created successfully.", returnData, true, 200);
        return;
      }
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },

  /**
   * get user detail
   */
   detail: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        Helper.handleError(res, 400, "Required inputs are invalid.", false, { error: errors.array() });
        return;
      }
      var returnData = await libUser.getUserById(req.params.id);
      Helper.respondAsJSON(res, "User detail successfully.", returnData, true, 200);
      return;
      
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },

  /**
   * update user detail
   */
   update: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        Helper.handleError(res, 400, "Required inputs are invalid.", false, { error: errors.array() });
        return;
      }

      //check email existing user have or not
      let userData = await libUser.checkExistsWithId(req.body.email,req.params.id);
      if(!userData){
        Helper.handleError(res, 200, "Email already exits.");
        return;
      }
      //update user if not exist same email
      let updateUser = await libUser.updateUser(req.params.id,req.body);
      if(updateUser){
        var returnData = await libUser.getUserById(updateUser.insertId);
        Helper.respondAsJSON(res, "User updated successfully.", returnData, true, 200);
        return;
      }
      
    } catch (Error) {
      Helper.handleError(res);
      return;
    }
  },

  /**
   * delete user detail
   */
     delete: async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          Helper.handleError(res, 400, "Required inputs are invalid.", false, { error: errors.array() });
          return;
        }
  
        //check email existing user have or not
        let userData = await libUser.checkExistsWithId(req.body.email,req.params.id);
        if(!userData){
          Helper.handleError(res, 200, "Email already exits.");
          return;
        }

        //delete user
        let deleteUser = await libUser.deleteUser(req.params.id);
        if(deleteUser){
          Helper.respondAsJSON(res, "User deleted successfully.", [], true, 200);
          return;
        }
        
      } catch (Error) {
        Helper.handleError(res);
        return;
      }
    },

}
