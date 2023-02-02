const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var regionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    capital: {
        type:String,
        required:true,
        unique:true,
    }
});

//Export the model
module.exports = mongoose.model('Region', regionSchema);