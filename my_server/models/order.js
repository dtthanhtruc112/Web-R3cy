const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    userid: Number,
    channel: String,
    ordernumber: Number,
    order_status: String,
    ordereddate: String,
    paymentmethod: String,
    paymentstatus: String,
    products: [{
        id: Number,
        category1: String,
        category2: String,
        name: String,
        price: Number,
        quantity: Number,
        feedback: String,
    }],
});

module.exports = mongoose.model('Order', Order);
