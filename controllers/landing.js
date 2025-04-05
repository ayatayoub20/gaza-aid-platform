const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const User = require('../models/User')
const Report = require('../models/Report')


router.get('/', async function (req, res, next) {
    
    const noUsers = await User.countDocuments({type:"volunteer"})
    const noReports = await Report.countDocuments({status:"closed"})
    
    res.render('landing/landingPage' , {noUsers , noReports , layout:false})
})



module.exports = router