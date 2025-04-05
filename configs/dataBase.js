const mongoose = require('mongoose');
const connectDatabase = function () {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true, //this is the code I added that solved it all

    }).then(async function (con) {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    })
}
module.exports = connectDatabase