const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const User = require('../models/User');
const Stranded = require('../models/Stranded');
const Report = require('../models/Report');
const Evaluation = require('../models/Evaluation');



router.get('/data/get', async function (req, res, next) {
    const query = req.query

    const queryValue = (req.query.search.value == '') ? {} : JSON.parse(query.search.value)
    let queryObj = {}

    if (queryValue.filter) {
        queryObj.$and = [queryValue.filter]
    }

    if (queryValue.search) {
        let val = queryValue.search
        const qu = {
            $regex: val,
            $options: 'i'
        }
        const searchQuery = { $or: [{ fullName: qu }, { nationalID: qu }, { phoneNumber: qu }] }
        if (queryValue.filter) {
            queryObj.$and.push(searchQuery)
        } else {
            queryObj = searchQuery
        }
    }

    const evaluationsCount = await Evaluation.countDocuments()
    const evaluationsFillterCount = await Evaluation.find(queryObj).countDocuments()
    const evaluations = await Evaluation.find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

    return res.json({
        recordsTotal: evaluationsCount,
        recordsFiltered: evaluationsFillterCount,
        evaluations,
    })
})


router.get('/page/get', async function (req, res, next) {
    res.render('evaluation/list')
})



module.exports = router