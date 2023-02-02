const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Mongo Database Connection Successfully')
    }
    catch (err) {
        console.log("Database connection error");
    }
}

module.exports = dbConnect;