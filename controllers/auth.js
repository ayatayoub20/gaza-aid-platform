const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash');
const { isAuthenticatedUser } = require('../middlewares/auth')
const mail = require('../utils/email')

const sendToken = require('../utils/jwtToken');
const User = require('../models/User');


router.get('/sign-up', async function (req, res, next) {
    res.render('auth/sign-up', { layout: false })
})

router.get('/sign-in', async function (req, res, next) {
    const { token } = req.cookies 
    if(token) return res.redirect('/dashboard')


    res.render('auth/sign-in', { layout: false })
})

router.get('/sign-out', async function (req, res, next) {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.redirect('/sign-in')

})
router.get('/forget-password', async function (req, res, next) {
  

    res.render('auth/forget-password' , {layout:false})

})

router.post('/sign-up', async function (req, res, next) {
    const { nationalID, fullName, phoneNumber, birthDate, password, email, city, region } = req.body

    const newUserObj = {
        nationalID, fullName, phoneNumber, birthDate, password, email, city, region,
        type: 'volunteer',
        position: 'volunteer',
        status: 'pending',
    }
    const newUser = new User(newUserObj)
    await newUser.save()
    res.json({ success: true })
})

router.post('/sign-in', async function (req, res, next) {
    const { email, password } = req.body;
    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('الرجاء إدخال البريد الإلكتروني وكلمة المرور.', 400))
    }
    // Finding user in database
    const user = await User.findOne({ email, password })

    if (!user) {
        return next(new ErrorHandler('خطأ في رقم البريد الإلكتروني أو كلمة المرور.', 400));
    }

    if (user.status == 'pending') return next(new ErrorHandler('في إنتظار الموافقة على طلبك!', 400))

    sendToken(user, 200, res)
})

router.post('/forget-password', async function (req, res, next) {
    const {email} = req.body
    const user = await User.findOne({email:email , status:'active'})
    if (!user) {
        return next(new ErrorHandler('لا يوجد بريد إلكتروني مطابق!', 400));
    }
    mail.send( user.email , 'forgetpassword' , user)
  

    res.json({success:true})

})


module.exports = router