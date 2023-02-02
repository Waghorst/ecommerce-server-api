const express = require("express");
const { createBlog, updateBlog, getBlog, getallBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require("../controllers/blog");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadimg");
const route = express.Router();

route.post('',authMiddleware, isAdmin, createBlog)
route.put("/upload/:id",authMiddleware, isAdmin, uploadPhoto.array("images", 2), blogImgResize, uploadImages)
route.put('/likes',authMiddleware, likeBlog)
route.put('/dislikes',authMiddleware, dislikeBlog)
route.put('/:id',authMiddleware, isAdmin, updateBlog)
route.get('/:id', getBlog)
route.get('/', getallBlog)
route.delete('/:id',authMiddleware, isAdmin, deleteBlog)

module.exports = route;