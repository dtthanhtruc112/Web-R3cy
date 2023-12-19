const express = require('express');
const router = express.Router();


// import models 
const User = require('../models/user')
const Address = require('../models/user')
const Order = require('../models/order')
const Product = require('../models/order')



// Tiến hành định nghĩa các API 

// Lấy data order
router.get("/orders", async (req, res) => {
    Order.find()
        .then(data => { res.json(data) })
        .catch(error => { res.status(500).json({ err: error.message }) })
});