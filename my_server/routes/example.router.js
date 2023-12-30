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
router.patch("/:id", async(req, res) =>{
  try{
      await Product.updateOne({ _id: req.params.id}, {
          $set: {
            name: req.body.name, 
            price: req.body.price,
            oldprice: req.body.oldprice,
            category1: req.body.category1,
            category2: req.body.category2,
            opt1: req.body.opt1,
            opt2: req.body.opt2,
            description: req.body.description,
            quantity: req.body.quantity,
            sold_quantity: req.body.sold_quantity
          }
      })
      res.send("Success!");
  }catch(error){
      res.json({error: error.mesage})
  }
})

//Router thêm sản phẩm
router.post("/product",cors(),async (req,res)=>{
  // Log dữ liệu nhận được từ req.body
  console.log('Received data:', req.body);

  // Tạo một đối tượng Product từ dữ liệu nhận được
  const newProduct = new Product(req.body);

  // Lưu đối tượng vào cơ sở dữ liệu
  try {
    const savedProduct = await newProduct.save();
    console.log('Product saved to database:', savedProduct);
    res.status(200).send('Product saved successfully');
  } catch (err) {
    console.error('Error saving product to database:', err);
    res.status(500).send('Internal Server Error');
  }})


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



// BLOG 

router.post('/createBlog', upload.single('thumbnail'), async (req, res) => {
  try {
    // Kiểm tra xem có tệp nào được tải lên không
    if (req.file && req.file.path) {
      const newBlog = new Blog({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        thumbnail: req.file.filename,
      });

      const savedBlog = await newBlog.save();
      res.json(savedBlog);
    } else {
      res.status(400).json({ error: 'Không có tệp nào được tải lên.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
// Router để cập nhật blog
router.patch('/blog/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const blogId = req.params.id;

    // Kiểm tra xem có tệp ảnh mới được tải lên không
    if (req.file && req.file.path) {
      // Nếu có, cập nhật thông tin blog và thumbnail
      const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        thumbnail: req.file.filename,
      }, { new: true });

      res.json(updatedBlog);
    } else {
      // Nếu không có ảnh mới, chỉ cập nhật thông tin blog
      const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
      }, { new: true });

      res.json(updatedBlog);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

//xử lý hình ảnh
router.get('/image/:id', cors(), (req, res) => {
  try {
    const id = req.params.id;
    const imagePath = path.join(__dirname, 'uploads', id);

    // Kiểm tra xem tệp tồn tại không trước khi gửi nó
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Không tìm thấy hình ảnh' });
    }
  } catch (error) {
    console.error('Error in /image/:id endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});


// API để lấy tất cả bài viết
router.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API để lấy các bài viết mới nhất
router.get('/blog/latestBlogs', async (req, res) => {
  try {
    const latestBlogs = await Blog.find().sort({ date: -1 }).limit(4);
    res.json(latestBlogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API để lấy chi tiết blog theo id
router.get('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  


// Middleware để xóa ảnh
const deleteImageMiddleware = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    // Tìm blog trong cơ sở dữ liệu
    const blog = await Blog.findById(blogId);

    if (blog && blog.thumbnail) {
      const imagePath = path.join(__dirname, '../uploads/', blog.thumbnail);

      // Kiểm tra xem hình ảnh có được sử dụng cho nhiều blog hay không
      const isImageUsed = await Blog.findOne({ thumbnail: blog.thumbnail, _id: { $ne: blogId } });

      // Nếu hình ảnh không được sử dụng cho bất kỳ blog nào khác, thì mới xóa
      if (!isImageUsed) {
        // Sử dụng Promise để bao bọc fs.unlink
        const unlinkPromise = () => {
          return new Promise((resolve, reject) => {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error('Error deleting image:', err);
                reject(err);
              } else {
                console.log(`Deleted image: ${imagePath}`);
                resolve();
              }
            });
          });
        };

        // Sử dụng await để đợi promise hoàn thành
        await unlinkPromise();
      } else {
        console.log('Image is used by other blogs. Do not delete.');
      }
    } else {
      console.log('No image to delete.');
    }

    // Gọi next mà không truyền tham số để báo hiệu kết thúc middleware
    next();
  } catch (err) {
    console.error('Error during deleteImageMiddleware:', err);
    // Gọi next với tham số để báo hiệu có lỗi và kết thúc middleware
    next(err);
  }
};



router.use(deleteImageMiddleware);
router.delete('/blog/:id', deleteImageMiddleware, async (req, res) => {
  try {
    const blogId = req.params.id;

    // Xóa blog khỏi cơ sở dữ liệu
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(deletedBlog);
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: error.message });
  }
});



// Xử lý route đăng ký

router.get("/accounts", cors(), async (req, res) => {
  const customers = await AccountCustomer.find({}).lean();
  res.send(customers);
});

router.post("/account", cors(), async (req, res) => {
  try {
    const customers = await AccountCustomer.find({}).lean(); // Sử dụng lean() để trả về dữ liệu dưới dạng JavaScript object thay vì document Mongoose
    res.send(customers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ err: error.message });
  }
});

router.post('/accounts', async (req, res) => {
  try {
    // Nhận dữ liệu từ request body
    const { Name, phonenumber, Mail, password } = req.body;

    // Tạo một instance mới của AccountCustomer từ dữ liệu nhận được
    const newAccount = new AccountCustomer({
      Name,
      phonenumber,
      Mail,
      password
    });

    // Lưu account mới vào database
    const savedAccount = await newAccount.save();

    res.status(201).json(savedAccount); // Trả về thông tin của account vừa tạo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API đăng nhập
router.post('/login', cors(), async (req, res) => {
  try {
    const { Mail, password } = req.body;

    // Tìm kiếm tài khoản với email tương ứng
    const user = await AccountCustomer.findOne({ Mail });

    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại' });
    }

    // Kiểm tra mật khẩu
    const isPasswordMatch = password === user.password;
    if (isPasswordMatch) {
      // Đăng nhập thành công
      // res.status(200).json({ message: 'Đăng nhập thành công', user: { ...user.toObject()} });
      res.status(200).json({ ...user.toObject() });
    } else {
      // Mật khẩu không đúng
      res.status(401).json({ message: 'Mật khẩu không đúng' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/accounts/:Mail", cors(), async (req, res) => {

  try {
    const phone = req.params.Mail;
    const user = await AccountCustomer.findOne({ Mail: phone });
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update-password', async (req, res) => {
  try {
    const Mail = req.body.Mail;
    const newPassword = req.body.newPassword;

    // Update the password in the database
    const user = await AccountCustomer.find({ Mail });
    await AccountCustomer.updateOne({ Mail }, { $set: { password: newPassword } });

    if (!user) {
      // If the user with the specified email is not found
      return res.status(404).json({ error: 'User not found' });
    }
    else {
      res.send({ message: 'Password updated successfully' });
    }

    // Send a success response
    res.json({ message: ' Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to handle custom product data with file upload
router.post('/customProducts', upload.single('pfile'), async (req, res) => {
  try {
    const customData = req.body;
    const savedCustomProduct = await CustomProduct.create(customData);

    res.status(201).json(savedCustomProduct);
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu sản phẩm tùy chỉnh:', error);
    res.status(500).json({ error: error.message || 'Lỗi Nội Bộ của Máy Chủ' });
  }
});

// GET route to retrieve all custom products
router.get('/customProducts', async (req, res) => {
  try {
    const customProducts = await CustomProduct.find();
    res.json(customProducts);
  } catch (error) {
    console.error('Error retrieving custom products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get customers information
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find();
    res.json(customers);
  } catch (error) {
    console.error('Error retrieving customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MANGE ACCOUNT
// GET tất cả admin có role là 'admin'
router.get('/adminaccs', async (req, res) => {
  try {
    const adminAccs = await AccountCustomer.find({ role: 'admin' });
    res.json(adminAccs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST 1 admin mới vào database
router.post('/addadmin', async (req, res) => {
  try {
    // Nhận dữ liệu từ request body
    const { Name, phonenumber, Mail, password } = req.body;

    // Tạo một instance mới của AccountCustomer từ dữ liệu nhận được
    const newAccount = new AccountCustomer({
      Name,
      phonenumber,
      Mail,
      password,
      role: 'admin'
    });

    // Lưu account mới vào database
    const savedAccount = await newAccount.save();

    res.status(201).json(savedAccount); // Trả về thông tin của account vừa tạo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update thông tin account
router.put('/updateadmin/:id', async (req, res) => {
  try {
    const accountId = req.params.id;

    // Kiểm tra xem account có tồn tại không
    const existingAccount = await AccountCustomer.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Nhận dữ liệu cần cập nhật từ request body
    const { Name, phonenumber, Mail } = req.body;

    // Cập nhật thông tin account
    existingAccount.Name = Name || existingAccount.Name;
    existingAccount.phonenumber = phonenumber || existingAccount.phonenumber;
    existingAccount.Mail = Mail || existingAccount.Mail;

    // Lưu thông tin account đã cập nhật vào database
    const updatedAccount = await existingAccount.save();

    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE xoá một admin theo id
router.delete('/deleteadmin/:id', async (req, res) => {
  try {
    const accountId = req.params.id;

    // Kiểm tra xem account có tồn tại không
    const existingAccount = await AccountCustomer.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Xoá tài khoản admin từ database
    await existingAccount.remove();

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
