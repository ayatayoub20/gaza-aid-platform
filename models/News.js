const moment = require('moment');
const mongoose = require('mongoose')
const { Schema } = mongoose;
const _ = require('lodash');


const NewsSchema = new Schema({
    status: {
        type:String,
        enum: ['active', 'deleted'], 
        default:'active'
    },
    title: {
        type: String,
        trim:true,
        required: true
    },
    body: {
        type: String,
        trim:true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId, ref: 'User',
        default: null
    },
    updatedBy: {
        type: Schema.Types.ObjectId, ref: 'User',
        default: null
    },
    updatedAt: {
        type: Date,
        default: null
    }

})
module.exports = mongoose.model('News', NewsSchema)