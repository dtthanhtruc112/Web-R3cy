const express = require('express')
const router = express.Router();

const Order = require('../models/order')
const User = require('../models/user')
const Blog = require('../models/blog')
const AccountCustomer = require('../models/accountcustomer.js')
const CustomProduct = require('../models/customproduct.js')
const Product = require('../models/product.js')
const Discount = require('../models/discount.js')
const bcrypt = require('bcrypt');

const { next } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Xử lí hình ảnh lúc upload
const multer = require('multer');

const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Giữ nguyên tên file
  }
});
const upload = multer({ storage: storage });


//API  
router.get('/', (req, res) => {
  res.send('Welcome to NodeJS');
})


router.use(bodyParser.json({ limit: '10mb' })); 
router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

//  CART
// Middleware để kiểm tra xem người dùng đã đăng nhập hay chưa


const checkAuth = (req, res, next) => {
  if (req.session && req.session.userid) {
    console.log("Session Data:", req.session);
    // Nếu đã đăng nhập, tiếp tục xử lý
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware để kiểm tra giỏ hàng của người dùng
const checkCart = async (req, res, next) => {
  if (req.session.userid) {
    try {
      const user = await User.findById(req.session.userid);
      if (user && user.cart) {
        req.cart = user.cart;
      } else {
        req.cart = [];
      }
    } catch (error) {
      console.error('Error checking user cart:', error);
      req.cart = [];
    }
  } else {
    req.cart = req.session.cart || [];
  }
  next();
};
// Router lấy sản phẩm theo id 
router.get('/product/:id', cors(), (req, res) => {
    const productId = req.params.id;
  
    console.log('Nhận yêu cầu cho ID sản phẩm:', productId);
  
    // Tìm sản phẩm theo id (số nguyên)
    Product.findOne({ id: parseInt(productId) })
      .then(product => {
        console.log('Tìm thấy sản phẩm:', product);
  
        if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
  
        res.json(product);
      })
      .catch(error => {
        console.error('Lỗi khi tìm sản phẩm:', error);
        res.status(500).json({ error: error.message });
      });
  });

// Route để thêm sản phẩm vào giỏ hàng
router.post('/cart/add', checkAuth, checkCart, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);
  
      if (product) {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = req.cart.find(item => item.productId.toString() === productId.toString());
  
        if (existingItem) {
          // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
          existingItem.quantity += quantity;
        } else {
          // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào giỏ hàng
          req.cart.push({ productId, quantity });
        }
  
        // Lưu giỏ hàng mới vào session hoặc cơ sở dữ liệu tùy thuộc vào việc người dùng đã đăng nhập hay chưa
        if (req.session.userid) {
          const user = await User.findByIdAndUpdate(req.session.userid, { cart: req.cart }, { new: true });
          req.cart = user.cart;
        } else {
          req.session.cart = req.cart;
          req.session.save();
        }
  
        res.status(200).json({ message: 'Product added to cart successfully', cart: req.cart });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: error.message });
    }
  });

  
// Route để cập nhật số lượng sản phẩm trong giỏ hàng
router.post('/cart/update', checkAuth, checkCart, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Tìm sản phẩm trong giỏ hàng
    const cartItem = req.cart.find(item => item.productId.toString() === productId.toString());

    if (cartItem) {
      // Cập nhật số lượng sản phẩm
      cartItem.quantity = quantity;

      // Lưu giỏ hàng mới vào session
      req.session.cart = req.cart;
      req.session.save();

      res.status(200).json({ message: 'Cart updated successfully', cart: req.cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route để xử lý thanh toán và tạo đơn hàng
router.post('/checkout', checkAuth, checkCart, async (req, res) => {
  try {
    // Lấy thông tin giỏ hàng từ session
    const cartItems = req.cart || [];

    // Tạo đơn hàng và lưu vào cơ sở dữ liệu
    const order = new Order({
      userid: req.session.userid,
      items: cartItems
    });

    await order.save();

    // Xóa thông tin giỏ hàng tạm thời từ session
    req.session.cart = [];
    req.session.save();

    res.status(200).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});







// Router lấy thông tin sản phẩm
router.get('/product', cors(), (req, res) =>
  Product.find()
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

    const mongoose = require('mongoose');

    
//Router lấy thông tin sản phẩm theo từng phân loại
router.get('/product/gia-dung', cors(), (req, res) =>
  Product.find({ category1: "Gia dụng" })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

router.get('/product/trang-tri', cors(), (req, res) =>
  Product.find({ category1: "Trang trí" })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

router.get('/product/phu-kien', cors(), (req, res) =>
  Product.find({ category1: "Phụ kiện" })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

//Router lấy sản phẩm theo từng mức giá
router.get('/product/duoi-100', cors(), (req, res) =>
  Product.find({ price: { $lt: 100 } })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

router.get('/product/100-den-200', cors(), (req, res) =>
  Product.find({ price: { $gte: 100, $lte: 200 } })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

router.get('/product/200-den-300', cors(), (req, res) =>
  Product.find({ price: { $gte: 200, $lte: 300 } })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

router.get('/product/tren-300', cors(), (req, res) =>
  Product.find({ price: { $gt: 300 } })
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.mesage }) }
    ));

//Router sửa thông tin sản phẩm
router.patch("/sanpham/:id", cors(), async(req, res) =>{
  try{
      await Product.updateOne({id: req.params.id}, {
          $set: {price: req.body.price}
      })
      res.send("Success!");
  }catch(error){
      res.json({error: error.mesage})
  }
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

// Router để lấy đơn hàng theo ordernumber
router.get("/orders/:ordernumber", async (req, res) => {
  try {
    const ordernumber = req.params.ordernumber;

    // Truy vấn để lấy đơn hàng cụ thể theo ordernumber
    const order = await Order.findOne({ ordernumber }).populate({ path: 'products', model: 'Product' });

    if (!order) {
      console.log(`Order not found for ordernumber ${ordernumber}`);
      return res.status(404).json({ err: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});


// Lấy danh sách sản phẩm trong order
router.get("/orders/user/:userid/:ordernumber/products", async (req, res) => {
  try {
    const { userid, ordernumber } = req.params;

    // Truy vấn để lấy đơn hàng cụ thể của người dùng
    const order = await Order.findOne({ userid, ordernumber }).populate({ path: 'products', model: 'Product' });

    if (!order) {
      console.log(`Order not found for ordernumber ${ordernumber} and userid ${userid}`);
      return res.status(404).json({ err: "Order not found" });
    }

    // Trả về danh sách sản phẩm trong đơn hàng
    res.json(order.products);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

// Cụ thể 1 product 
router.get("/orders/user/:userid/:ordernumber/products/:productid", async (req, res) => {
  try {
    const { userid, ordernumber, productid } = req.params;

    // Truy vấn để lấy đơn hàng cụ thể của người dùng
    const order = await Order.findOne({ userid, ordernumber }).populate({ path: 'products', model: 'Product' });

    if (!order) {
      console.log(`Order not found for ordernumber ${ordernumber} and userid ${userid}`);
      return res.status(404).json({ err: "Order not found" });
    }

    // Tìm kiếm sản phẩm trong danh sách sản phẩm của đơn hàng
    const product = order.products.find(product => product.id === parseInt(productid));

    if (!product) {
      console.log(`Product not found for productid ${productid} in order ${ordernumber}`);
      return res.status(404).json({ err: "Product not found" });
    }

    // Trả về thông tin của sản phẩm cụ thể
    res.json(product);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});


// Cập nhật order
router.patch("/orders/user/:userid/:ordernumber", async (req, res) => {
  try {
    const { userid, ordernumber } = req.params;

    // Tìm đơn hàng theo userid và ordernumber
    const orderToUpdate = await Order.findOne({ userid, ordernumber });

    if (!orderToUpdate) {
      return res.status(404).json({ err: "Order not found" });
    }

    // Cập nhật các trường thông tin
    if (req.body.order_status) {
      orderToUpdate.order_status = req.body.order_status;
    }

    if (req.body.paymentstatus) {
      orderToUpdate.paymentstatus = req.body.paymentstatus;
    }

    if (req.body.feedback) {
      orderToUpdate.feedback = req.body.feedback;
    }

    if (req.body.rejectreason) {
      orderToUpdate.rejectreason = req.body.rejectreason;
    }



    // Lưu các thay đổi
    await orderToUpdate.save();

    // Trả về đơn hàng đã được cập nhật
    const updatedOrder = await Order.findOne({ userid, ordernumber }).populate({ path: 'products', model: 'Product' });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ err: error.message });
  }
});

router.put("/orders/user/:userid/:ordernumber", async (req, res) => {
  try {
    const { userid, ordernumber } = req.params;

    // Tìm đơn hàng theo userid và ordernumber
    const orderToUpdate = await Order.findOne({ userid, ordernumber });

    if (!orderToUpdate) {
      return res.status(404).json({ err: "Order not found" });
    }

    // Cập nhật các trường thông tin
    orderToUpdate.order_status = req.body.order_status || orderToUpdate.order_status;
    orderToUpdate.paymentstatus = req.body.paymentstatus || orderToUpdate.paymentstatus;
    orderToUpdate.feedback = req.body.feedback || orderToUpdate.feedback;
    orderToUpdate.rejectreason = req.body.rejectreason || orderToUpdate.rejectreason;

    // Lưu các thay đổi
    await orderToUpdate.save();

    // Trả về đơn hàng đã được cập nhật
    const updatedOrder = await Order.findOne({ userid, ordernumber }).populate({ path: 'products', model: 'Product' });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error:", error);
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

// Cập nhật sản phẩm trong order 
router.patch("/orders/user/:userid/:ordernumber/products/:productid", async (req, res) => {
  try {
    const { userid, ordernumber, productid } = req.params;

    // Truy vấn để lấy đơn hàng cụ thể của người dùng
    const order = await Order.findOne({ userid, ordernumber }).populate({ path: 'products', model: 'Product' });

    if (!order) {
      console.log(`Order not found for ordernumber ${ordernumber} and userid ${userid}`);
      return res.status(404).json({ err: "Order not found" });
    }

    // Tìm kiếm sản phẩm trong danh sách sản phẩm của đơn hàng
    const product = order.products.find(product => product.id === parseInt(productid));

    if (!product) {
      console.log(`Product not found for productid ${productid} in order ${ordernumber}`);
      return res.status(404).json({ err: "Product not found" });
    }

    // Cập nhật các trường thông tin nếu có trong body của PATCH request
    if (req.body.quantity !== undefined) {
      product.quantity = req.body.quantity;
    }

    if (req.body.feedback !== undefined) {
      product.feedback = req.body.feedback;
    }

    // Lưu các thay đổi
    await order.save();

    // Trả về thông tin đã cập nhật của sản phẩm
    res.json(product);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});
// GET thông tin discount


router.get('/discount', async (req, res) => {
  try {
    const discount = await Discount.find()
    res.json(discount);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

// API to get discount details by code
router.get('/discount/:code', async (req, res) => {
  try {
    // Find the discount by code
    const discount = await Discount.findOne({ code: req.params.code });

    // Check if the discount is found
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
