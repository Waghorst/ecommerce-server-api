const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Market = require("../models/market");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createMarket = asyncHandler(async (req, res) => {
    try {
        const newMarket = await Market.create(req.body);
        res.json(newMarket);
    } catch (error) {
        throw new Error(error)
    }
})

const updateMarket = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const updateMarket = await Market.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateMarket);
    } catch (error) {
        throw new Error(error)
    }
})

const getMarket = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const getMarket = await Market.findById(id)
        res.json(getMarket);
    } catch (error) {
        throw new Error(error)
    }
})

const getallMarket = asyncHandler(async (req, res) => {
    try {
        const getallMarket = await Market.find()
        res.json(getallMarket);
    } catch (error) {
        throw new Error(error)
    }
})

const deleteMarket = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const deleteMarket = await Market.findByIdAndDelete(id)
        res.json(deleteMarket);
    } catch (error) {
        throw new Error(error)
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
        const findMarket = await Market.findByIdAndUpdate(id, {
            images: urls.map(file=>{
                return file
            })
        }, {new: true});
        res.json(findMarket);
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createMarket, updateMarket, getMarket, getallMarket, deleteMarket, uploadImages}
