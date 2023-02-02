const express = require('express');
const { createProduct, getProduct, getallProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require('../controllers/product');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadimg');
const route = express.Router();

route.post('/',authMiddleware, isAdmin, createProduct)
route.put("/upload/:id",authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages)
route.get('/:id', getProduct)
route.put('/wishlist', authMiddleware, addToWishlist)
route.put('/rating', authMiddleware, rating)
route.get('/', getallProducts)
route.put('/:id',authMiddleware, isAdmin, updateProduct)
route.delete('/:id',authMiddleware, isAdmin, deleteProduct)

module.exports = route;