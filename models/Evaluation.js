const moment = require('moment');
const mongoose = require('mongoose')
const { Schema } = mongoose;
const _ = require('lodash');


const evaluationSchema = new Schema({
    type: {
        type: String,
        enum:['stToVol' , 'volToSt' , 'stToBur'],
        required: true
    },
    report: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    location: {
        type: String,
    },
    description: {
        type: String,
    },
    rate: { type: Number, required: true },
    volunteer: { type: Schema.Types.ObjectId, ref: 'User' },
    stranded: { type: Schema.Types.ObjectId, ref: 'Stranded'},

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
module.exports = mongoose.model('Evaluation', evaluationSchema)