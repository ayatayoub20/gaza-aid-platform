const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const jwt = require("jsonwebtoken");
const User = require('../models/User')

const { CITIES, REPORTS_TYPES, REPORTS_STATUS } = require('../data/constants')

const News = require('../models/News')
const { isAuthenticatedUser } = require('../middlewares/auth')


const authzUser = async (req,res)=>{
    let user = null
    try {
        const { token } = req.cookies || {token: null}

        if (!token) {
            return user
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
         user = await User.findById(decoded.id);
        if(!user)  {        
            return user
        }
        return user
    
    } catch (error) {
        return user

    }
}

router.get('/page/get', async function (req, res, next) {
    const user = await authzUser(req)
    res.render('news/list', { user , layout: false })
})

router.get('/data/get', async function (req, res, next) {
    const user = await authzUser(req)

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
        const searchQuery = { $or: [{ title: qu }, { body: qu }] }
        if (queryValue.filter) {
            queryObj.$and.push(searchQuery)
        } else {
            queryObj = searchQuery
        }
    }

    const newsCount = await News.countDocuments({ status: 'active' })
    const newsFillterCount = await News.find({ status: 'active' }).find(queryObj).countDocuments()
    const news = await News.find({  status: 'active' }).find(queryObj).limit(parseInt(query.length)).sort({createdAt:-1}).skip(parseInt(query.start)).populate('createdBy')

   

    return res.json({
        recordsTotal: newsCount,
        recordsFiltered:newsFillterCount, 
        news,
        user,
        CITIES,

    })
})



router.post('/new',isAuthenticatedUser, async function (req, res, next) {
    const { title, body } = JSON.parse(req.body.payload)
    const newNews = new News({
        title, body,
        createdBy: req.user._id
    })
    await newNews.save()
    res.json({ success: true })
})


router.get('/delete/:id', async function (req, res, next) {
    const user = await authzUser(req)
    const id = req.params.id
    await News.findByIdAndDelete(id)
    res.json({success:true})
})



module.exports = router