const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Order = new Schema({
    userid: Number,
    channel: { type: String, default: 'Website' },
    ordernumber: { type: Number, unique: true },
    order_status: { type: String, default: 'Chờ xử lí' },
    ordereddate: String,
    paymentmethod: String,
    paymentstatus: { type: Boolean, default: false },
    shipfee: Number,
    products: [{
        id: Number,
        category1: String,
        category2: String,
        name: String,
        price: Number,
        quantity: Number,
        feedback: { type: String, default: '' },
    }],
    rejectreason: { type: String, default: '' }
});


Order.pre('save', async function (next) {
    if (!this.ordernumber) {
        // Nếu ordernumber không tồn tại, thực hiện logic tăng giảm chỉ số
        const maxordernumber = await mongoose.model('Order').findOne({}, { ordernumber: 1 }, { sort: { ordernumber: -1 } });
        this.ordernumber = maxordernumber ? maxordernumber.ordernumber + 1 : 1;
    }

    next();
});



module.exports = mongoose.model('Order', Order);
// Order.plugin(AutoIncrement, {inc_field: 'ordernumber', start_seq: 1007})