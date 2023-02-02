const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const auth = require('./routes/auth');
const product = require('./routes/product');
const market = require('./routes/market');
const blog = require('./routes/blog');
const category = require('./routes/category');
const region = require('./routes/region');
const coupon = require('./routes/coupon');
const cookieParser = require('cookie-parser');
const { notFound, errorHandle } = require('./middlewares/errHandle');
const morgan = require('morgan');
dbConnect()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use('/api/user', auth)
app.use('/api/product', product)
app.use('/api/market', market)
app.use('/api/blog', blog)
app.use('/api/category', category)
app.use('/api/region', region)
app.use('/api/coupon', coupon)

app.use(notFound)
app.use(errorHandle)


app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})