const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const User = require('../models/User');
const Stranded = require('../models/Stranded');
const Report = require('../models/Report');
const Evaluation = require('../models/Evaluation');


router.get('/', async function (req, res, next) {
    res.render('report/list')
})

router.get('/statistics/page/get', async function (req, res, next) {
    const openReportCount = await Report.countDocuments({status:'open'});
    const runningReportCount = await Report.countDocuments({status:'running'});
    const closedReportCount = await Report.countDocuments({status:'closed'});
    const deletedReportCount = await Report.countDocuments({status:'deleted'});

    const strandedCount = await Stranded.countDocuments({status:'active'});
    const volunteerCount = await User.countDocuments({status:'active' , type:'volunteer'});
    const adminCount = await User.countDocuments({status:'active' , type:'admin'});

    const evaluationsCount = await Evaluation.countDocuments({status:'active'})

    res.render('statistics' , {
        openReportCount , runningReportCount , closedReportCount , deletedReportCount , 
        strandedCount , volunteerCount , adminCount , evaluationsCount
    })
})



module.exports = router