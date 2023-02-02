const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var marketSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description: {
        type:String,
        required:true,
    },
    isFeatured:false,
    region:{
        type:String,
        required:true,
    },
    capital: {
        type:String,
        required:true,
    },
    images:[],
    ratings:{
        type:Number,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Market', marketSchema);