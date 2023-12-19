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

router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users);
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});


module.exports = router
