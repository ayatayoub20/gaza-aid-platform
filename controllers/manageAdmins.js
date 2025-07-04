const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const User = require('../models/User')
const { CITIES, REPORTS_TYPES, REPORTS_STATUS } = require('../data/constants')


router.get('/page/get', async function (req, res, next) {
    res.render('admin/list')
})

router.get('/data/get', async function (req, res, next) {

    const query = req.query

    let queryValue = {};
try {
    const searchValue = req.query?.search?.value;
    queryValue = (searchValue && searchValue.trim() !== '') ? JSON.parse(searchValue) : {};
} catch (err) {
    console.error("Error parsing search.value as JSON:", err.message);
    queryValue = {};
}

    console.log("البيانات المستلمة من الواجهة:", req.query);

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

    const adminsCount = await User.countDocuments({ type: 'admin', status: 'active' })
    const adminsFillterCount = await User.find({ type: 'admin', status: 'active' }).find(queryObj).countDocuments()
    const admins = await User.find({ type: 'admin', status: 'active' }).find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

    return res.json({
        draw: Number(req.query.draw) || 0,
        recordsTotal: adminsCount,
        recordsFiltered: adminsFillterCount,
        data: admins
    });
    
})

router.post('/new', async function (req, res, next) {
    const { nationalID, fullName, phoneNumber, birthDate, password, email, city , region }  = JSON.parse(req.body.payload)
    const newUserObj = {
        nationalID, fullName, phoneNumber, birthDate, password, email, city , region,
        type:'admin',
        position:'admin',
        status:'active',
    }
    const newUser = new User(newUserObj)
    await newUser.save()
    res.json({ success: true })


})


module.exports = router