const asyncHandler = require("express-async-handler");
const Blog = require("../models/blog");
const User = require("../models/user");
const validateMongoDbId = require("../utils/validateMongoDbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require('fs')

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error)
    }
})


const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {numberViews: 1},
            },
            {new: true}
        )
        res.json(getBlog);
    } catch (error) {
        throw new Error(error)
    }
})

const getallBlog = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error)
    }
})


const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error)
    }
})


const likeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId)
        const blog = await Blog.findById(blogId)
        const loginUserId = await req?.user?._id;
        const isLiked = blog?.isLiked;
        const alreadyDisliked = blog?.dislikes?.find((userId) =>userId?.toString() === loginUserId.toString())
        if(alreadyDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {dislikes: loginUserId},
                    isDisliked: false

                }, {new: true}
                )
            res.json(blog)
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {likes: loginUserId},
                    isLiked: false

                }, {new: true}
                )
            res.json(blog)
        }else{
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $push: {likes: loginUserId},
                    isLiked: true

                }, {new: true}
                )
            res.json(blog)
        }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId)
        const blog = await Blog.findById(blogId)
        const loginUserId = await req?.user?._id;
        const isDisLiked = blog?.isDisliked;
        const alreadyLiked = blog?.likes?.find((userId) =>userId?.toString() === loginUserId.toString())
        if(alreadyLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {likes: loginUserId},
                    isLiked: false

                }, {new: true}
                )
            res.json(blog)
        }
        if(isDisLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {dislikes: loginUserId},
                    isDisliked: false

                }, {new: true}
                )
            res.json(blog)
        }else{
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $push: {dislikes: loginUserId},
                    isDisliked: true

                }, {new: true}
                )
            res.json(blog)
        }
})

const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images")
        const urls = []
        const files = req.files;
        for(const file of files) {
            const {path} = file;
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map(file=>{
                return file
            })
        }, {new: true});
        res.json(findBlog);
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBlog, updateBlog, getBlog, getallBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages }