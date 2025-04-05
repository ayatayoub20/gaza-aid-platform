const express = require('express');
require('dotenv').config({ path: './configs/config.env' })
const path = require('path')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler');
const {isAuthenticatedUser} = require('./middlewares/auth')
const expressLayouts = require('express-ejs-layouts');



const dashboardController = require('./controllers/dashboard')
const authController = require('./controllers/auth')
const utilsController = require('./controllers/utils')
const manageVolunteersController = require('./controllers/manageVolunteers')
const manageAdminsController = require('./controllers/manageAdmins')
const manageReportsController = require('./controllers/manageReports')
const manageUsersController = require('./controllers/manageUsersController')

const landingController = require('./controllers/landing')
const manageNewsController = require('./controllers/manageNews')
const manageEvaluationController = require('./controllers/evaluation')


const app = express();
//settings 

app.use(expressLayouts)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.set("layout extractScripts", true)

app.use(express.static(path.join(__dirname, 'public')))



// routes
app.use('/' , authController)
app.use('/' , landingController)
app.use('/news', manageNewsController)
app.use('/evaluations',isAuthenticatedUser, manageEvaluationController)

app.use('/utils', utilsController)

app.use('/reports', manageReportsController)
app.use('/dashboard',isAuthenticatedUser, dashboardController)
app.use('/admins',isAuthenticatedUser ,  manageAdminsController)
app.use('/volunteers',isAuthenticatedUser, manageVolunteersController)
app.use('/users',isAuthenticatedUser, manageUsersController)



// Middleware to handle errors
app.use(errorMiddleware);


module.exports = app

