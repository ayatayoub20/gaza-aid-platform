const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const { CITIES, REPORTS_TYPES, REPORTS_STATUS } = require('../data/constants')
const mail = require('../utils/email')

const _ = require('lodash')
const User = require('../models/User')


router.get('/page/get', async function (req, res, next) {
  res.render('volunteer/list')
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
    const searchQuery = { $or: [{ fullName: qu }, { nationalID: qu }, { phoneNumber: qu }] }
    if (queryValue.filter) {
      queryObj.$and.push(searchQuery)
    } else {
      queryObj = searchQuery
    }
  }

  const volunteersCount = await User.countDocuments({ type: 'volunteer', status: 'active' })
  const volunteersFillterCount = await User.find({ type: 'volunteer', status: 'active' }).find(queryObj).countDocuments()
  const volunteers = await User.find({ type: 'volunteer', status: 'active' }).find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

  return res.json({
    recordsTotal: volunteersCount,
    recordsFiltered: volunteersFillterCount,
    volunteers
  })
})

router.get('/requests/page/get', async function (req, res, next) {
  res.render('volunteer/requests-list')
})

router.get('/requests/data/get', async function (req, res, next) {
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

  const volunteersCount = await User.countDocuments({ type: 'volunteer', $or: [{ status: 'pending' }, { status: 'rejected' }] })
  const volunteersFillterCount = await User.find({ type: 'volunteer', $or: [{ status: 'pending' }, { status: 'rejected' }] }).find(queryObj).countDocuments()
  const volunteers = await User.find({ type: 'volunteer', $or: [{ status: 'pending' }, { status: 'rejected' }] }).find(queryObj).limit(parseInt(query.length)).skip(parseInt(query.start))

  return res.json({
    recordsTotal: volunteersCount,
    recordsFiltered: volunteersFillterCount,
    volunteers,
    CITIES,

  })
})

router.get('/approve/:id', async function (req, res, next) {
  const volunteerID = req.params.id

  if (!mongoose.isValidObjectId(volunteerID)) return next(new ErrorHandler('bad volunteer id!', 400))
  const volunteer = await User.findOne({ _id: volunteerID, status: 'pending' })
  //await mail.send(volunteer.email , 'activation' , volunteer)
  volunteer.status = 'active'
  await volunteer.save({validateBeforeSave: false})

  //await User.updateOne({ _id: volunteerID, status: 'pending' }, { status: 'active' })

  res.redirect('back')
})

router.get('/reject/:id', async function (req, res, next) {
  const volunteerID = req.params.id
  if (!mongoose.isValidObjectId(volunteerID)) return next(new ErrorHandler('bad volunteer id!', 400))
  const volunteer = await User.findOne({ _id: volunteerID, status: 'pending' })
  //await mail.send(volunteer.email , 'rejection' , volunteer)
  volunteer.status = 'rejected'
  await volunteer.save({validateBeforeSave: false})

  res.redirect('back')
})


router.get('/upgrade/:id', async function (req, res, next) {
  const volunteerID = req.params.id
  if (!mongoose.isValidObjectId(volunteerID)) return next(new ErrorHandler('bad volunteer id!', 400))
  await User.updateOne({ _id: volunteerID }, { type: 'admin' , position:'admin' })

  res.json({success:true})
})




module.exports = router