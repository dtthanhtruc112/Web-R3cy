const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    category1: String,
    category2: String,
    name: String,
    description: String,
    opt1: String,
    opt2: String,
    price: Number,
    oldprice: Number,
    img1:String,
    img2: String,
    img3: String,
    rate: Number,
    avt1: String,
    accountfb1: String,
    fb1: String,
    ask1: String,
    answer1: String,
    ask2: String,
    answer2: String,
    quantity: Number,
    sold_quantity: Number,
    input_ask: String,
    input_name: String
});

module.exports = mongoose.model('Product', Product);