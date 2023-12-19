const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: Number },
    category1: { type: String },
    category2: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    feedback: { type: String }
});

const Order = new Schema({
    userid: { type: Number },
    channel: { type: String },
    ordernumber: { type: Number },
    order_status: { type: String },
    ordereddate: { type: String },
    paymentmethod: { type: String },
    paymentstatus: { type: String },
    products: [Product]  
});

module.exports = mongoose.model('Order', Order);