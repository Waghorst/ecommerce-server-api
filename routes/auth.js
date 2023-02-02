const express = require("express");
const {
  createUser,
  loginUser,
  getallUser,
  getUser,
  deleteUser,
  updateUser,
  unblockUser,
  blockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getuserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/user");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const route = express.Router();

route.post("/register", createUser);
route.post("/login", loginUser);
route.post("/forgot-password-token", forgotPasswordToken);
route.put("/reset-password/:token", resetPassword);
route.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
route.put("/password", authMiddleware, updatePassword);
route.post("/admin-login", loginAdmin);
route.post("/cart", authMiddleware, userCart);
route.get("/all-users", getallUser);
route.get("/get-orders",authMiddleware, getOrders);
route.get("/refresh", handleRefreshToken);
route.get("/logout", logout);
route.get("/wishlist", authMiddleware, getWishlist);
route.get("/cart", authMiddleware, getuserCart);
route.delete("/empty-cart", authMiddleware, emptyCart);
route.post("/cart/applycoupon", authMiddleware, applyCoupon);
route.post("/cart/cash-order", authMiddleware, createOrder);
route.get("/:id", authMiddleware, isAdmin, getUser);
route.delete("/:id", deleteUser);
route.put("/edit-user", authMiddleware, updateUser);
route.put("/save-address", authMiddleware, saveAddress);
route.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
route.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = route;
