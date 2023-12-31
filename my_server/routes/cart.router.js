const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const AccountCustomer = require('../models/accountcustomer.js');
const Order = require('../models/order')

const cors = require('cors');
const bodyParser = require('body-parser');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.use(bodyParser.json({ limit: '10mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

router.get('/', (req, res) => {
  res.send('Welcome to NodeJS');
});


// Router để lấy dữ liệu theo khoảng thời gian
router.get('/api/orders-summary', async (req, res) => {
  try {
      const range = req.query.range;
      const channel = req.query.channel;

      let data;
      if (range === 'today') {
          data = await fetchDataForToday(channel);
      } else if (range === 'thisMonth') {
          data = await fetchDataForThisMonth(channel);
      } else if (range === 'all') {
          data = await fetchDataForAll(channel);
      } else {
          return res.status(400).json({ error: 'Invalid range value' });
      }

      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Hàm truy vấn dữ liệu đơn hàng cho hôm nay
async function fetchDataForToday(channel) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Thêm giờ, phút, giây và mili giây cuối cùng của ngày vào endDay
  const endDay = new Date(today);
  endDay.setUTCHours(23, 59, 59, 999);

  return await fetchData(channel, today, endDay);
}

// Hàm truy vấn dữ liệu đơn hàng cho tháng
async function fetchDataForThisMonth(channel) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Set startDay là 00:00 của ngày đầu tiên của tháng
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);

  // Enđay là cuối ngày hôm nay
  const endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  return await fetchData(channel, startDay, endDay);
}




// Hàm truy vấn dữ liệu đơn hàng toàn bộ
async function fetchDataForAll(channel) {
  return await fetchData(channel);
}

// Hàm chung để thực hiện truy vấn dữ liệu
async function fetchData(channel, startDate, endDate) {
  const dateQuery = startDate && endDate ? { ordereddate: { $gte: startDate, $lt: endDate } } : {};
  console.log('startDate:', startDate);
  console.log('endDate:', endDate);
  console.log('dateQuery:', dateQuery);
  

  const orders = await Order.find({ channel, ...dateQuery }).populate({ path: 'products', model: 'Product' });
  // console.log('Orders with populated products:', orders);

 

  // Trả về dữ liệu đơn hàng dưới dạng JSON
  return {
      totalAmount: calculateTotalAmount(orders),
      totalOrders: orders.length,
      products: await getProductDetailsForBestSellingProduct(orders),
      // Thêm các thông tin khác cần thiết
  };
}

// Hàm lấy thông tin chi tiết của sản phẩm bán chạy nhất
async function getProductDetailsForBestSellingProduct(orders) {
  const bestSellingProduct = findBestSellingProduct(orders.flatMap(order => order.products));

  if (bestSellingProduct) {
      const productDetails = await getProductDetailsFromDatabase(bestSellingProduct.id);
      return { totalQuantitySold: bestSellingProduct.quantity, bestSellingProduct: productDetails };
  } else {
      return { totalQuantitySold: 0, bestSellingProduct: null };
  }
}

// Hàm truy vấn thông tin chi tiết của sản phẩm từ DB Product
async function getProductDetailsFromDatabase(productId) {
  try {
      const productDetails = await Product.findOne({ id: productId });
      return productDetails;
  } catch (error) {
      throw error;
  }
}

// Hàm tính tổng giá trị đơn hàng
function calculateTotalAmount(orders) {
  return orders.reduce((total, order) => total + order.totalAmount, 0);
}

// Hàm tính tổng số lượng sản phẩm đã bán và sản phẩm bán chạy nhất
function calculateTotalQuantitySoldAndBestSellingProduct(orders) {
  const allProducts = orders.flatMap(order => order.products);
  const totalQuantitySold = allProducts.reduce((total, product) => total + product.quantity, 0);

  const bestSellingProduct = findBestSellingProduct(allProducts);

  console.log('bestSellingProduct:', bestSellingProduct); // Thêm console log ở đây

  return {
      totalQuantitySold,
      bestSellingProduct,
  };
}

// Hàm tìm sản phẩm bán chạy nhất
function findBestSellingProduct(products) {
  if (products.length === 0) {
      return null;
  }

  // Sắp xếp mảng sản phẩm theo quantity giảm dần
  const sortedProducts = [...products].sort((a, b) => b.quantity - a.quantity);

  // console.log('sortedProducts:', sortedProducts); // Thêm console log ở đây

  return sortedProducts[0]; // Sản phẩm ở đầu mảng là sản phẩm có quantity lớn nhất
}



router.get('/product/:id', cors(), (req, res) => {
  const productId = req.params.id;

  console.log('Nhận yêu cầu cho ID sản phẩm:', productId);

  Product.findOne({ id: parseInt(productId) })
    .then((product) => {
      console.log('Tìm thấy sản phẩm:', product);

      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      res.json(product);
    })
    .catch((error) => {
      console.error('Lỗi khi tìm sản phẩm:', error);
      res.status(500).json({ error: error.message });
    });
});



// router.post('/cart/add', async (req, res) => {
//   try {
//     const { userid, productId, quantity } = req.body;
//     console.log('req.body:', req.body);

//     const product = await Product.findOne({ id: productId });
//     // Kiểm tra userid là số nguyên
//     // if (!Number.isInteger(userid)) {
//     //   return res.status(400).json({ message: 'Invalid userid' });
//     // }

//     // // Kiểm tra productId là số nguyên
//     // if (!Number.isInteger(productId)) {
//     //   return res.status(400).json({ message: 'Invalid productId' });
//     // }

//     // // Kiểm tra quantity là số nguyên dương
//     // if (!Number.isInteger(quantity) || quantity <= 0) {
//     //   return res.status(400).json({ message: 'Invalid quantity' });
//     // }

//     if (!product) {
//       return res.status(404).json({ message: `Product with id ${productId} not found` });
//     }

//     let cart = await Cart.findOne({ userid: userid });

//     if (!cart) {
//       // Tạo giỏ hàng mới nếu không tìm thấy
//       const newCart = new Cart({ userid, cartItems: [] });
//       await newCart.save();
//       console.log('New Cart created:', newCart);
//       cart = newCart;
//     }

//     console.log('Cart before adding product:', cart);

//     const existingItem = cart.cartItems.find((item) => item.id.toString() === productId.toString());

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.cartItems.push({
//         id: product.id,
//         category1: product.category1,
//         category2: product.category2,
//         name: product.name,
//         price: product.price,
//         quantity: quantity,
//       });
//     }

//     await cart.save();

//     console.log('Cart after adding product:', cart);
//     res.status(200).json({
//       message: 'Product added to cart successfully',
//       cart: cart.cartItems,
//       userid: userid,
//     });
//   } catch (error) {
//     console.error('Error adding product to cart:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// GET giỏ hàng dựa trên userid
router.get('/cart/:userid', async (req, res) => {
  try {
    const userid = parseInt(req.params.userid);

    // Kiểm tra xem userid có phải là số nguyên dương không
    if (!Number.isInteger(userid) || userid <= 0) {
      return res.status(400).json({ message: 'Invalid userid' });
    }

    // Tìm kiếm giỏ hàng của người dùng dựa trên userid
    const cart = await Cart.findOne({ userid: userid });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Trả về dữ liệu giỏ hàng
    res.status(200).json({ cart: cart.cartItems, userid: userid });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: error.message });
  }
});


// Xóa sản phẩm khỏi giỏ hàng
router.delete('/cart/remove/:userid/:itemid', async (req, res) => {
  try {
    const userId = parseInt(req.params.userid);
    const itemId = parseInt(req.params.itemid);

    // Kiểm tra xem userId và itemId có hợp lệ không
    if (!Number.isInteger(userId) || !Number.isInteger(itemId) || userId <= 0 || itemId <= 0) {
      return res.status(400).json({ message: 'Invalid userId or itemId' });
    }

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userid: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cart.cartItems = cart.cartItems.filter(item => item.id !== itemId);

    // Lưu thay đổi
    await cart.save();

    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: error.message });
  }
});


router.put('/cart/update-quantity/:userId/:itemId', async (req, res) => {
  try {
      const userId = parseInt(req.params.userId);
      const itemId = parseInt(req.params.itemId);
      const newQuantity = parseInt(req.body.quantity);

      // Kiểm tra xem userId và itemId có phải là số nguyên dương không
      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(itemId) || itemId <= 0) {
          return res.status(400).json({ message: 'Invalid userId or itemId' });
      }

      // Kiểm tra xem newQuantity có phải là số nguyên dương không
      if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
          return res.status(400).json({ message: 'Invalid quantity' });
      }

      // Tìm giỏ hàng của người dùng dựa trên userId
      const cart = await Cart.findOne({ userid: userId });

      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      // Tìm sản phẩm trong giỏ hàng dựa trên itemId
      const cartItem = cart.cartItems.find((item) => item.id === itemId);

      if (!cartItem) {
          return res.status(404).json({ message: 'Cart item not found' });
      }

       // Cập nhật số lượng của sản phẩm trong giỏ hàng
        cartItem.quantity = newQuantity;
        cartItem.subtotal = cartItem.price * newQuantity; // Cập nhật subtotal

        // Cập nhật giá trị subtotal cho tất cả các sản phẩm trong giỏ hàng
        cart.cartItems.forEach(item => {
          item.subtotal = item.price * item.quantity;
        });
      

      // Lưu giỏ hàng đã cập nhật vào cơ sở dữ liệu
      await cart.save();

      res.status(200).json({ message: 'Quantity updated successfully', cart: cart.cartItems, userId: userId });
  } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ error: error.message });
  }
});

// POST: Thêm sản phẩm vào giỏ hàng
router.post('/cart/add', async (req, res) => {
  try {
    const { userid, productId, quantity } = req.body;

    // Kiểm tra userid, productId và quantity là số nguyên dương
    if (!Number.isInteger(userid) || !Number.isInteger(productId) || !Number.isInteger(quantity) || userid <= 0 || productId <= 0 || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid userid, productId, or quantity' });
    }

    // Tìm sản phẩm dựa trên productId
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: `Product with id ${productId} not found` });
    }

    // Tìm giỏ hàng của người dùng dựa trên userid
    let cart = await Cart.findOne({ userid: userid });

    if (!cart) {
      // Tạo giỏ hàng mới nếu không tìm thấy
      const newCart = new Cart({ userid, cartItems: [] });
      await newCart.save();
      cart = newCart;
    }

    // Chuyển đổi giá trị id thành số nguyên
    const productIdAsNumber = parseInt(productId);

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = cart.cartItems.find((item) => item.id === productIdAsNumber);

    if (existingItem) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      existingItem.quantity += quantity;
      cartItem.subtotal = cartItem.price * existingItem.quantity; // Cập nhật subtotal

    // Cập nhật giá trị subtotal cho tất cả các sản phẩm trong giỏ hàng
    cart.cartItems.forEach(item => {
      item.subtotal = item.price * item.quantity;
    });
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
      cart.cartItems.push({
        id: productIdAsNumber,
        category1: product.category1,
        category2: product.category2,
        name: product.name,
        price: product.price,
        quantity: quantity,
        subtotal: product.price * quantity,
      });
    }
     // Cập nhật giá trị subtotal cho tất cả các sản phẩm trong giỏ hàng
     cart.cartItems.forEach(item => {
      item.subtotal = item.price * item.quantity;
    });


    // Lưu giỏ hàng đã cập nhật vào cơ sở dữ liệu
    await cart.save();

    res.status(200).json({
      message: 'Product added to cart successfully',
      cart: cart.cartItems,
      userid: userid,
    });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: error.message });
  }
});
// GET: Lấy thông tin tài khoản theo userid
router.get('/account/:userid', async (req, res) => {
  try {
    const userid = parseInt(req.params.userid);

    // Kiểm tra xem userid có phải là số nguyên dương không
    if (!Number.isInteger(userid) || userid <= 0) {
      return res.status(400).json({ message: 'Invalid userid' });
    }

    // Tìm tài khoản dựa trên userid
    const account = await AccountCustomer.findOne({ userid: userid });

    if (!account) {
      return res.status(404).json({ message: `Account with userid ${userid} not found` });
    }

    res.status(200).json({
      message: 'Account information retrieved successfully',
      account: account,
    });
  } catch (error) {
    console.error('Error retrieving account information:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tạo order và xóa giỏ hàng
router.post("/orders/user/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    // Lấy thông tin giỏ hàng của người dùng
    const cart = await Cart.findOne({ userid: userid });

    // Kiểm tra xem giỏ hàng có tồn tại không
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Tạo đối tượng Order mới từ dữ liệu yêu cầu
    const newOrder = new Order({
      userid,
      channel: req.body.channel || 'Website',
      order_status: req.body.order_status || 'Chờ xử lí',
      ordereddate: req.body.ordereddate,
      paymentmethod: req.body.paymentmethod,
      paymentstatus: req.body.paymentstatus,
      shipfee: req.body.shipfee,
      ordernote: req.body.ordernote,
      orderadress: req.body.orderadress,
      products: [], // Khởi tạo danh sách sản phẩm trống
      rejectreason: '',
    });

    // Lấy thông tin chi tiết sản phẩm từ DB Product
    const productIds = cart.cartItems.map(item => item.id);
    const products = await Product.find({ id: { $in: productIds } });

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!products || products.length !== productIds.length) {
      return res.status(404).json({ message: 'Some products not found' });
    }

    // Duyệt qua danh sách sản phẩm từ DB và thêm vào đơn hàng
    products.forEach(product => {
      const cartItem = cart.cartItems.find(item => item.id === product.id);

      const orderProduct = {
        id: product.id,
        category1: product.category1,
        category2: product.category2,
        name: product.name,
        price: product.price,
        img1: product.img1,
        quantity: cartItem.quantity,
      };

      newOrder.products.push(orderProduct);
    });

    // Lưu đối tượng Order vào cơ sở dữ liệu
    const createdOrder = await Order.create(newOrder);

    // Xóa giỏ hàng của người dùng
    await Cart.deleteOne({ userid: userid });

    // Trả về đơn hàng đã được tạo mới
    res.json(createdOrder);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ err: error.message });
  }
});
// Các phần còn lại không thay đổi

module.exports = router;
