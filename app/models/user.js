'use strict';
import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const User = new Schema({
    chatid: Number,
    isbot: Boolean,
    firstname: String,
    lastname: String,
    username: String,
    languagecode: String,
    state: String,
    clientid: Number
}, { versionKey: false });

module.exports = mongoose.model('user', User);