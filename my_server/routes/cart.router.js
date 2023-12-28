const express = require('express');
const router = express.Router();

const cors = require('cors');
const bodyParser = require('body-parser');

router.use(cors)
router.use(bodyParser.json({ limit: '10mb' })); 
router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product.js')

//API  
router.get('/', (req, res) => {
    res.send('Welcome to NodeJS');
  })
// Middleware để kiểm tra xem người dùng đã đăng nhập hay chưa
const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    // Nếu đã đăng nhập, tiếp tục xử lý
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware để kiểm tra giỏ hàng của người dùng
const checkCart = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
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
        if (req.session.userId) {
          const user = await User.findByIdAndUpdate(req.session.userId, { cart: req.cart }, { new: true });
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
      userId: req.session.userId,
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

// ... (các route khác)

module.exports = router;
