//const User = require('../models/User')

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/User')

// Checks if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies || {token: null}
    let user = null
    try {
        if (!token) {
            return next(new ErrorHandler('Login first to access this resource.', 401))
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
         user = await User.findById(decoded.id);
        if(!user)  {        
            return next(new ErrorHandler('user not found!.', 401))
        }
        req.user = user 
        res.locals.user = req.user
        next()
    
    } catch (error) {
        return next(error)

    }
}
