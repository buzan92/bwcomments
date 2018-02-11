'use strict';
import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const Client = new Schema({
    id: Number,
    orgname: String,
    createdate: Number
}, { versionKey: false });

module.exports = mongoose.model('client', Client);