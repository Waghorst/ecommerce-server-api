const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Coupon = require("../models/coupon");

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
})


const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateCoupon);
    } catch (error) {
        throw new Error(error)
    }
})


const getCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const getCoupon = await Coupon.findById(id)
        res.json(getCoupon);
    } catch (error) {
        throw new Error(error)
    }
})

const getallCoupon = asyncHandler(async (req, res) => {
    try {
        const getallCoupon = await Coupon.find()
        res.json(getallCoupon);
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id)
        res.json(deleteCoupon);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createCoupon, updateCoupon, getCoupon, getallCoupon, deleteCoupon }