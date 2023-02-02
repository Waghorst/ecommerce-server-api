const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type:Number,
        default:0,
    },
    isLiked: {
        type:Boolean,
        default:false,
    },
    isDisliked: {
        type:Boolean,
        default:false,
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
],
dislikes: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
],
image: {
    type: String,
    default: 'https://www.teledataict.com/media/2022/02/blog_online_business.jpg'
},
author: {
    type: String,
    default: 'Administrator'
},
images: [],
},
{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);