const router = require('express').Router()
const ErrorHandler = require('../utils/errorHandler');
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const { isAuthenticatedUser } = require('../middlewares/auth')

const { CITIES, REPORTS_TYPES, REPORTS_STATUS } = require('../data/constants')
const User = require('../models/User');
const Stranded = require('../models/Stranded');

const Report = require('../models/Report');
const Evaluation = require('../models/Evaluation');
const uploadFile = require('../configs/firebase');
const deleteFile = require('../utils/deleteFile');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//Stranded


router.get('/new', async function (req, res, next) {

    res.render('report/new', { layout: false })
})
router.get('/stranded/open/data/get/:id', async function (req, res, next) {
    const strandedID = req.params.id

    const reportsCount = await Report.countDocuments({ stranded: strandedID, status: 'open' })
    const reports = await Report.find({ stranded: strandedID, status: 'open' }).sort({ createdAt: -1 }).populate('volunteer')
    return res.json({
        recordsTotal: reportsCount,
        recordsFiltered: reportsCount,
        reports,
        CITIES, REPORTS_TYPES,
    })

})
router.get('/stranded/running/data/get/:id', async function (req, res, next) {
    const strandedID = req.params.id

    const reportsCount = await Report.countDocuments({ stranded: strandedID, status: 'running' })
    const reports = await Report.find({ stranded: strandedID, status: 'running' }).sort({ createdAt: -1 }).populate('volunteer')

    return res.json({
        recordsTotal: reportsCount,
        recordsFiltered: reportsCount,
        reports,
        CITIES, REPORTS_TYPES,
    })
})

router.get('/stranded/closed/data/get/:id', async function (req, res, next) {
    const strandedID = req.params.id

    const reportsCount = await Report.countDocuments({ stranded: strandedID, status: 'closed' })
    const reports = await Report.find({ stranded: strandedID, status: 'closed' }).sort({ createdAt: -1 }).limit(20).populate('volunteer')

    return res.json({
        recordsTotal: reportsCount,
        recordsFiltered: reportsCount,
        reports,
        CITIES, REPORTS_TYPES,
    })


})

router.get('/stranded/delete/:id', async function (req, res, next) {
    const reportID = req.params.id
    if (!mongoose.isValidObjectId(reportID)) return next(new ErrorHandler('bad report id!', 400))
    await Report.updateOne({ _id: reportID }, { status: 'deleted' })
    res.json({ success: true })
})


router.get('/search/page/get', async function (req, res, next) {
    res.render('report/stranded/search-report', { layout: false })

})


router.get('/stranded/page/get/:id', async function (req, res, next) {
    const strandedID = req.params.id
    if (!mongoose.isValidObjectId(strandedID)) return next(new ErrorHandler('bad stranded id!', 400))

    const stranded = await Stranded.findById(strandedID)
    if (!stranded) return next(new ErrorHandler('لا يوجد نتائج للبحث!', 404))



    res.render('report/stranded/list', { stranded, CITIES, REPORTS_TYPES, REPORTS_STATUS, moment, layout: false })

})
router.post('/new', upload.array('image', 2), async function (req, res, next) {
    const { fullName, nationalID, phoneNumber, birthDate, city, region, type, location, description } = JSON.parse(req.body.payload)
    let files = req.files;

    const newReportData = {
        status: 'open',
        description,
        type,
        location,
    }

    let stranded = await Stranded.findOne({ $or: [{ fullName }, { phoneNumber }] })

    if (!stranded) {
        const newStranded = new Stranded({
            fullName, nationalID, birthDate, phoneNumber, city, region,
            status: 'active',
        })
        newReportData.stranded = newStranded._id
        await newStranded.save()
        stranded = newStranded
    } else {
        _.assign(stranded, {
            city, region
        })
        await stranded.save()

    }

    newReportData.stranded = stranded._id
    const newReport = new Report(newReportData)

    const promises = files.map(async (file, i) => {
        const object = {}
        if (file !== undefined) {

            let fileURL = await uploadFile(
                i + '',
                `attachments/files/${file.filename}`,
                file.mimetype,
                file.path
            );
            newReport.image = fileURL
            return deleteFile(file.path);
        }
    })
    await Promise.all(promises)
    await newReport.save({ validateBeforeSave: false })
    res.end()

})

router.post('/volunteer/rate/:id', async function (req, res, next) {
    const reportID = req.params.id
    if (!mongoose.isValidObjectId(reportID)) return next(new ErrorHandler('bad report id!', 400))

    const report = await Report.findById(reportID)
    if (!report) return next(new ErrorHandler('report not found!', 404))


    const volunteer = await User.findById(report.volunteer)

    if (!volunteer) return next(new ErrorHandler('volunteer not found!', 404))

    const { rate = 5, description = '' } = JSON.parse(req.body.payload)

    const newEvaluation = new Evaluation({
        type: 'stToVol',
        rate,
        description,
        report: report._id,
        volunteer: volunteer._id,
        stranded: report.stranded,
        createdBy: report.stranded
    })
    await newEvaluation.save()

    report.strandedEvaluation = newEvaluation._id
    await report.save({validateBeforeSave:false})
    const evaluations = await Evaluation.find({type:'stToVol' , volunteer:volunteer._id}).lean()
    const sum = evaluations.reduce((x , y)=> x + y.rate , 0)
    const avg = sum / evaluations.length
    volunteer.rate = avg
    await volunteer.save({ validateBeforeSave: false })
    res.end()
})

router.post('/stranded/search', async function (req, res, next) {
    const { query } = req.body

    const searchQuery = { $or: [{ phoneNumber: query, email: query }] }
    const stranded = await Stranded.findOne(searchQuery)
    if (!stranded) return next(new ErrorHandler('لا يوجد نتائج للبحث!', 404))
    res.json({ stranded: stranded._id })

})





//Admin&Volunteer

router.get('/data/get', isAuthenticatedUser, async function (req, res, next) {

    res.render('dashboard/cpanel')
})

router.get('/open/data/get', isAuthenticatedUser, async function (req, res, next) {

    const reportsCount = await Report.countDocuments({ status: 'open' })
    const reports = await Report.find({ status: 'open' }).sort({ createdAt: -1 }).populate('volunteer').populate('stranded')

    return res.json({
        recordsTotal: reportsCount,
        recordsFiltered: reportsCount,
        reports,
        CITIES, REPORTS_TYPES,
    })

})

router.get('/running/data/get', isAuthenticatedUser, async function (req, res, next) {
    const reportsCount = await Report.countDocuments({ status: 'running' })
    const reports = await Report.find({ status: 'running' }).sort({ createdAt: -1 }).populate('volunteer').populate('stranded')

    return res.json({
        recordsTotal: reportsCount,
        recordsFiltered: reportsCount,
        reports,
        CITIES, REPORTS_TYPES,
    })
})

router.get('/closed/data/get', isAuthenticatedUser, async function (req, res, next) {
    const reportsCount = await Report.countDocuments({ status: 'closed' })
    const reports = await Report.find({ status: 'closed' }).sort({ createdAt: -1 }).limit(20).populate('volunteer').populate('stranded')

    return res.json({
        recordsTotal: reportsCount,
        recordsFiltered: reportsCount,
        reports,
        CITIES, REPORTS_TYPES,
    })


})

router.get('/page/get/:id', isAuthenticatedUser, async function (req, res, next) {
    const reportID = req.params.id
    if (!mongoose.isValidObjectId(reportID)) return next(new ErrorHandler('bad report id!', 400))

    const report = await Report.findById(reportID).populate('volunteer').populate('stranded')
    if (!report) return next(new ErrorHandler('report not found!', 404))
    let evaluation = null

    if (report.status == 'closed') {
        evaluation = await Evaluation.findOne({ report: report._id }).sort({ createdAt: -1 })
    }

    res.render('report/view', { report, evaluation, CITIES, REPORTS_TYPES, REPORTS_STATUS, moment })

})

router.get('/recive/:id', isAuthenticatedUser, async function (req, res, next) {
    const reportID = req.params.id
    if (!mongoose.isValidObjectId(reportID)) return next(new ErrorHandler('bad report id!', 400))

    const action = req.query.action

    const report = await Report.findById(reportID)
    if (!report) return next(new ErrorHandler('report not found!', 404))
    if (report.status == 'closed') return next(new ErrorHandler('report is closed !', 400))

    if (action == 'recive') {
        report.status = 'running'
        report.volunteer = req.user._id
        report.recivedAt = moment()

    } else {
        report.status = 'open'
        report.volunteer = null
    }
    await report.save({ validateBeforeSave: false })
    res.json({ success: true })

})

router.get('/delete/:id', isAuthenticatedUser, async function (req, res, next) {
    const reportID = req.params.id
    if (!mongoose.isValidObjectId(reportID)) return next(new ErrorHandler('bad report id!', 400))
    await Report.updateOne({ _id: reportID }, { status: 'deleted' })
    res.json({ success: true })
})


router.post('/rate/:id', isAuthenticatedUser, async function (req, res, next) {
    const reportID = req.params.id
    if (!mongoose.isValidObjectId(reportID)) return next(new ErrorHandler('bad report id!', 400))

    const report = await Report.findById(reportID)
    if (!report) return next(new ErrorHandler('report not found!', 404))


    const volunteer = await User.findById(report.volunteer)

    if (!volunteer) return next(new ErrorHandler('volunteer not found!', 404))

    const { rate = 5, description = '' } = JSON.parse(req.body.payload)

    const newEvaluation = new Evaluation({
        type: 'volToSt',
        rate,
        description,
        volunteer: volunteer._id,
        stranded: report.stranded,

        report: report._id,
        createdBy: req.user._id
    })
    await newEvaluation.save()

    report.status = 'closed'
    report.volunteerEvaluation = newEvaluation._id
    await report.save({ validateBeforeSave: false })

    volunteer.numberOfClosedReport++
    await volunteer.save({ validateBeforeSave: false })
    res.end()
})





module.exports = router