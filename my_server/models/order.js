const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Order = new Schema({
    userid: Number,
    channel: String,
    ordernumber: Number,
    order_status: String,
    ordereddate: String,
    paymentmethod: String,
    paymentstatus: Boolean,
    products: [{
        id: Number,
        category1: String,
        category2: String,
        name: String,
        price: Number,
        quantity: Number,
        feedback: String,
    }],
    rejectreason: String
});

// Order.plugin(AutoIncrement, {inc_field: 'ordernumber', start_seq: 1007})

module.exports = mongoose.model('Order', Order);
