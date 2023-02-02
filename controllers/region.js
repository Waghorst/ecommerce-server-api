const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Region = require("../models/region");

const createRegion = asyncHandler(async (req, res) => {
    try {
        const newRegion = await Region.create(req.body);
        res.json(newRegion);
    } catch (error) {
        throw new Error(error)
    }
})


const updateRegion = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const updateRegion = await Region.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateRegion);
    } catch (error) {
        throw new Error(error)
    }
})


const getRegion = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const getRegion = await Region.findById(id)
        res.json(getRegion);
    } catch (error) {
        throw new Error(error)
    }
})

const getallRegion = asyncHandler(async (req, res) => {
    try {
        const getallRegion = await Region.find()
        res.json(getallRegion);
    } catch (error) {
        throw new Error(error)
    }
})

const deleteRegion = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const deleteRegion = await Region.findByIdAndDelete(id)
        res.json(deleteRegion);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createRegion, updateRegion, getRegion, getallRegion, deleteRegion }