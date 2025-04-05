const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const { CITIES, REPORTS_TYPES, REPORTS_STATUS } = require('../data/constants')

const _ = require('lodash')
const User = require('../models/User')


router.get('/profile/:id', async function (req, res, next) {
    const userID = req.params.id
    const user = await User.findById(userID)
    res.render('profile/user/view', { user, CITIES, moment })

})
router.get('/profile/edit/:id', async function (req, res, next) {
    const userID = req.params.id
    const user = await User.findById(userID)

    res.render('profile/user/edit', { user, CITIES, moment })

})
router.get('/password/change/:id', async function (req, res, next) {
    const userID = req.params.id
    const user = await User.findById(userID)
    res.render('profile/user/change-password', { user, CITIES, moment })

})


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
        const searchQuery = { $or: [{ formalID: qu }, { name: qu }, { phoneNumber: qu }] }
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
        recordsTotal: adminsCount,
        recordsFiltered: adminsFillterCount,
        admins
    })
})

router.post('/new', async function (req, res, next) {
    const { nationalID, fullName, phoneNumber, birthDate, password, email, city , region } = JSON.parse(req.body.payload)
    const newUserObj = {
        nationalID, fullName, phoneNumber, birthDate, password, email, city , region,
        type: 'admin',
        position: 'admin',
        status: 'active',
    }
    const newUser = new User(newUserObj)
    await newUser.save()
    res.json({ success: true })
})

router.post('/profile/edit/:id', async function (req, res, next) {
    const userID = req.params.id
    const { nationalID, fullName, phoneNumber, birthDate, email, city, region } = JSON.parse(req.body.payload)
    const user = await User.findById(userID)
    _.assign(user, { nationalID, fullName, phoneNumber, birthDate, email, city, region })
    await user.save()
    res.render('profile/user/view', { user, CITIES, moment })

})

router.post('/password/change/:id', async function (req, res, next) {
    const id = req.params.id
    const data = JSON.parse(req.body.payload);
    if (!mongoose.isValidObjectId(id)) return next(new ErrorHandler('', 404))

    let user = await User.findById(id)
    if (!user) return next(new ErrorHandler('', 404))
    if (data.password == data.confirmPassword) {
        user.password = data.password
        user.save()
        res.status(200).json(user._id)
    } else {
        return res.status(404).json({ error: "كلمة المرور غير متطابقة" })
    }


})

router.get('/delete/:id', async function (req, res, next) {
    const userID = req.params.id
    if (!mongoose.isValidObjectId(userID)) return next(new ErrorHandler('bad user id!', 400))
    await User.updateOne({ _id: userID }, { status: 'deleted' })
  
  
    res.json({success:true})
  
  })
  

module.exports = router