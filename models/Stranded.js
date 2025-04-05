const moment = require('moment');
const mongoose = require('mongoose')
const { Schema } = mongoose;


const strandedSchema = new Schema({
    fullName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'رقم الجوال مطلوب!'],
        validate: {
            validator: function (v) {
                return !isNaN(Number(v)) && (v.indexOf('059') === 0 || v.indexOf('056') === 0)
            },
            message: 'رقم الجوال غير صالح'
        },
        trim: true
    },
    birthDate: {
        type: Date,
        trim: true
    },
    age: {
        type: Number,
    },
    city: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'active', 'blocked', 'deleted'],
            message: 'حالة المستخدم غير صالحة!'
        },
        trim: true,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

strandedSchema.pre('save', function (next) {
    this.age = moment().diff(this.birthDate, 'years')
    next()
});


module.exports = mongoose.model('Stranded', strandedSchema)