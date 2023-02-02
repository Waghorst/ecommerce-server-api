const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createRegion, updateRegion, getRegion, getallRegion, deleteRegion } = require("../controllers/region");
const route = express.Router();

route.post('/', authMiddleware, isAdmin, createRegion)
route.put('/:id',authMiddleware, isAdmin, updateRegion)
route.get('/:id',authMiddleware, isAdmin, getRegion)
route.get('/',authMiddleware, isAdmin, getallRegion)
route.delete('/:id',authMiddleware, isAdmin, deleteRegion)


module.exports = route;