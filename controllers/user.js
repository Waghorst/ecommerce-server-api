const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendaEmail = require("./email");
const crypto = require("crypto");
const uniqid = require("uniqid");

// create user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lasttname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});


// login admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if(findAdmin.role !== "admin") throw new Error("Not Authorized");
  if (findAdmin && (await findAdmin.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lasttname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});


// logout user
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present in db or matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
  res.json(user);
});

// Save user address

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
})

// get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// get single user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await User.findById(id);
    res.json({
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update user

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findOneAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User is Blocked",
      blockUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User is Unblocked",
      unblockUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email });
    if(!user) throw new Error('User not found with this email')
    try {
        const token = await user.createPasswordResetToken()
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click</a>`;
        const data = {
            to: email,
            text: "Hey, User",
            subject: "Forgot Password Link",
            htm: resetURL
        }
        sendaEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } =req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOneAndUpdate({
        passwordResetToken: hashedToken,
        passswordResetExpires: { $gt: Date.now()}
    });
    if(!user) throw new Error("Token Expired, Please try again");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);

})


const getWishlist = asyncHandler(async(req, res)=>{
  const {_id} = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist")
    res.json(findUser)
  } catch (error) {
    throw new Error(error);
  }
})


const userCart = asyncHandler(async(req, res)=>{
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id)
    const alreadyExistCart = Cart.findOne({orderby: user._id})
    if(alreadyExistCart){
      alreadyExistCart.remove()
    }
    for(let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price').exec();
      object.price = getPrice.price;
      products.push(object)
    }
    let cartTotal = 0;
      for (let i = 0; i < products.length; i++) {
        cartTotal += products[i].price * products[i].count;
      }
      let newCart = await Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).save();
      res.json(newCart);
  } catch (error) {
    throw new Error(error)
  }
})


const getuserCart = asyncHandler(async (req, res) => {
  const {_id } = req.user;
  validateMongoDbId(_id)
  try {
    const cart = await Cart.findOne({orderby: _id}).populate(
      "products.product"
    );
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})


const emptyCart = asyncHandler(async (req, res) => {
  const {_id } = req.user;
  validateMongoDbId(_id)
  try {
    const user = await User.findOne({_id})
    const cart = await Cart.findOneAndRemove({orderby: user._id})
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

const applyCoupon = asyncHandler(async (req, res) => {
  const {coupon} = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id)
  const validCoupon = await Coupon.findOne({name: coupon})
  if(validCoupon === null){
    throw new Error('Invalid coupon!')
  }
  const user = await User.findOne({_id})
  let {cartTotal} = await Cart.findOne({orderby: user._id}).populate("products.product")
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
  await Cart.findOneAndUpdate({orderby: user._id}, {totalAfterDiscount}, {new: true});
  res.json(totalAfterDiscount)
})


const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const {_id} = req.user;
  validateMongoDbId(_id)
  try {
    if(!COD) throw new Error("Cash order failed to be created")
    const user = await User.findById(_id)
    let userCart = await Cart.findOne({orderby:user._id});
    let finalAmount = 0;
    if(couponApplied && userCart.totalAfterDiscount){
      finalAmount = userCart.totalAfterDiscount;
    }else{
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "Ghc",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save()
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: {_id: item.product._id},
          update: {$inc: {quantity: -item.count, sold: +item.count}}
        }
      }
    })
    const updated = await Product.bulkWrite(update, {})
    res.json({message: "success"})
  } catch (error) {
    throw new Error(error)
  }
})


const getOrders = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  validateMongoDbId(_id)
  try {
    const userorders = await Order.findOne({orderby: _id}).populate("products.product").exec();
    res.json(userorders)
  } catch (error) {
    throw new Error(error)
  }
})


const updateOrderStatus = asyncHandler(async (req, res) => {
  const {status} = req.body;
  const {id} = req.params;
  validateMongoDbId(id)
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(id,
      {
       orderStatus: status,
       paymentIntent: {
         status: status
       }
     }, 
      {
       new: true
     }
     );
     res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error)
  }
})


module.exports = {
  createUser,
  loginUser,
  getallUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
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
};
