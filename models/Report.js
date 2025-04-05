const moment = require('moment');
const mongoose = require('mongoose')
const { Schema } = mongoose;
const _ = require('lodash');


const reportSchema = new Schema({
    status: {
        type:String,
        enum: ['open', 'closed', 'running', 'deleted'],
        required:true
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    location: {
        latitude:{type:Number  , required: true },
        longitude:{type:Number  , required: true }
    },
    volunteer: { type: Schema.Types.ObjectId, ref: 'User' },
    stranded: { type: Schema.Types.ObjectId, ref: 'Stranded', required: true },
    volunteerEvaluation: { type: Schema.Types.ObjectId, ref: 'Evaluation'},
    strandedEvaluation: { type: Schema.Types.ObjectId, ref: 'Evaluation' }, 

    description:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    recivedAt: {
        type: Date,
    }
})
module.exports = mongoose.model('Report', reportSchema)