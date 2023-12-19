const express = require('express')
const router = express.Router();

const Order = require('../models/order')
const User = require('../models/user')

// 
router.get('/', (req, res) => {
    res.send('Welcome to NodeJS');
})





router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate({ path: 'products', model: 'Product' });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// Router cho lấy đơn hàng theo userid
router.get("/orders/user/:userid", async (req, res) => {
    try {
        const orders = await Order.find({ userid: req.params.userid }).populate({ path: 'products', model: 'Product' });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

// Router để lấy danh sách mã đơn hàng của một người dùng
router.get("/orders/user/:userid/:ordernumber", async (req, res) => {
    try {
        const { userid, ordernumber } = req.params;

        // Truy vấn để lấy đơn hàng cụ thể của người dùng
        const order = await Order.findOne({ userid, ordernumber }).populate({ path: 'products', model: 'Product' });

        if (!order) {
            console.log(`Order not found for ordernumber ${ordernumber} and userid ${userid}`);
            return res.status(404).json({ err: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});



router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});


module.exports = router
