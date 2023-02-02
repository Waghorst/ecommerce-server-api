const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCategory, updateCategory, getCategory, getallCategory, deleteCategory } = require("../controllers/category");
const route = express.Router();

route.post('/', authMiddleware, isAdmin, createCategory)
route.put('/:id',authMiddleware, isAdmin, updateCategory)
route.get('/:id',authMiddleware, isAdmin, getCategory)
route.get('/',authMiddleware, isAdmin, getallCategory)
route.delete('/:id',authMiddleware, isAdmin, deleteCategory)


module.exports = route;