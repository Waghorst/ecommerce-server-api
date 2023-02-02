const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCoupon, updateCoupon, getCoupon, getallCoupon, deleteCoupon } = require("../controllers/coupon");
const route = express.Router();

route.post('/', authMiddleware, isAdmin, createCoupon)
route.put('/:id',authMiddleware, isAdmin, updateCoupon)
route.get('/:id',authMiddleware, isAdmin, getCoupon)
route.get('/',authMiddleware, isAdmin, getallCoupon)
route.delete('/:id',authMiddleware, isAdmin, deleteCoupon)


module.exports = route;