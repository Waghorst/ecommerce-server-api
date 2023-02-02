const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createMarket, updateMarket, getMarket, getallMarket, deleteMarket, uploadImages } = require("../controllers/market");
const { uploadPhoto, marketImgResize } = require("../middlewares/uploadimg");
const route = express.Router();

route.post('/', authMiddleware, isAdmin, createMarket)
route.put("/upload/:id",authMiddleware, isAdmin, uploadPhoto.array("images", 10), marketImgResize, uploadImages)
route.put('/:id',authMiddleware, isAdmin, updateMarket)
route.get('/:id',authMiddleware, isAdmin, getMarket)
route.get('/',authMiddleware, isAdmin, getallMarket)
route.delete('/:id',authMiddleware, isAdmin, deleteMarket)


module.exports = route;