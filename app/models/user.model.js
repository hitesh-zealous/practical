'use strict';

let mongoose = require('bluebird').promisifyAll(require('mongoose'));
let Schema = mongoose.Schema;
let autopopulate = require('mongoose-autopopulate');

let User = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: 'user'
  },
  token: {
    type: String,
  }
}, { timestamps: true, versionKey: false });

User.plugin(autopopulate);

module.exports = mongoose.model('User', User);