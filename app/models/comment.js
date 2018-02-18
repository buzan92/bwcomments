'use strict';
import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const Comment = new Schema({
    clientid: Number,
    chatid: Number,
    msgid: Number,
    createdate: Number,
    content: String,
    photo: String,
    reply: [{
        createdate: Number,
        content: String
    }]
    /*
    comments: [{
        type: String, //review || response
        createdate: Number,
        content: String,
        photo: String 
    }],
    */
}, { versionKey: false });

module.exports = mongoose.model('comment', Comment);