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

// Router lấy thông tin mã giảm giá
router.get('/discount', cors(), (req, res) =>
  Discount.find()
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.message }) }
    ));

router.get('/discount/dang-ap-dung', cors(), (req, res) =>
  Discount.find({status: "Đang áp dụng"})
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.message }) }
    ));

router.get('/discount/da-len-lich', cors(), (req, res) =>
  Discount.find({status: "Đã lên lịch"})
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.message }) }
    ));

router.get('/discount/da-het-han', cors(), (req, res) =>
  Discount.find({status: "Đã hết hạn"})
    .then(data => { res.json(data) })
    .catch(error => { res.status(500).json({ err: error.message }) }
    ));

//Router sửa thông tin mã giảm giá
router.patch("/:id", async(req, res) =>{
  try{
      await Discount.updateOne({ _id: req.params.id}, {
          $set: {
            code: req.body.code, 
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            activate_date: req.body.activate_date,
            expired_date: req.body.expired_date,
            valuecode: req.body.valuecode
          }
      })
      res.send("Success!");
  }catch(error){
      res.json({error: error.mesage})
  }
})

//Router xóa mã giảm giá
router.delete('/:id', async (req, res) => {
  try {
    const discountId = req.params.id;

    // Kiểm tra xem sản phẩm có tồn tại không
    const existingDiscount = await Discount.findById(discountId);
    if (!existingDiscount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    // Xoá sản phẩm từ database
    await Discount.deleteOne({ _id: discountId });

    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount on server:', error);
    res.status(500).json({ error: error.message });
  }
});

//Router thêm mã giảm giá
router.post("/discount",cors(),async (req,res)=>{
  // Log dữ liệu nhận được từ req.body
  console.log('Received data:', req.body);

  // Tạo một đối tượng Product từ dữ liệu nhận được
  const newDiscount = new Discount(req.body);

  // Lưu đối tượng vào cơ sở dữ liệu
  try {
    const savedDiscount = await newDiscount.save();
    console.log('Discount saved to database:', savedDiscount);
    res.status(200).send('Discount saved successfully');
  } catch (err) {
    console.error('Error saving discount to database:', err);
    res.status(500).send('Internal Server Error');
  }})


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
            sold_quantity: req.body.sold_quantity,
            input_ask: req.body.input_ask,
            input_name: req.body.input_name,
            input_answer: req.body.input_answer
          }
      })
      res.send("Success!");
  }catch(error){
      res.json({error: error.mesage})
  }
})

//Router xóa sản phẩm
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Kiểm tra xem sản phẩm có tồn tại không
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Xoá sản phẩm từ database
    await Product.deleteOne({ _id: productId });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product on server:', error);
    res.status(500).json({ error: error.message });
  }
});

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

// //  Tạo order
// router.post("/orders/user/:userid", async (req, res) => {
//   try {
//       const { userid } = req.params;

//       // Tạo một đối tượng Order mới từ dữ liệu yêu cầu
//       const newOrder = new Order({
//           userid,
//           channel: req.body.channel || 'Website',
//           order_status: req.body.order_status || 'Chờ xử lí',
//           ordereddate: req.body.ordereddate,
//           paymentmethod: req.body.paymentmethod,
//           paymentstatus: req.body.paymentstatus,
//           shippingfee: req.body.shippingfee,
//           totalOrderValue: req.body.totalOrderValue,
//           discount: req.body.discount,
//           totalAmount: req.body.totalAmount,
//           ordernote: req.body.ordernote,
//           orderadress: req.body. orderadress,
//           products: [], // Khởi tạo danh sách sản phẩm trống
//           rejectreason: req.body.rejectreason,
//           address: req.body.address,
//       });

//       // Duyệt qua danh sách sản phẩm từ yêu cầu và thêm vào danh sách sản phẩm của đơn hàng
//       if (req.body.products && req.body.products.length > 0) {
//           req.body.products.forEach(productData => {
//               const product = {
//                   id: productData.id || 0, // Thay đổi logic tạo ID tùy thuộc vào yêu cầu của bạn
//                   category1: productData.category1,
//                   category2: productData.category2,
//                   name: productData.name,
//                   price: productData.price,
//                   quantity: productData.quantity,
//                   feedback: productData.feedback,
//                   img1: productData.img1,
//               };
//               newOrder.products.push(product);
//           });
//       }

//       // Lưu đối tượng Order vào cơ sở dữ liệu
//       const createdOrder = await Order.create(newOrder);

//       // Trả về đơn hàng đã được tạo mới
//       res.json(createdOrder);
//   } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ err: error.message });
//   }
// });


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

// router.put('/update-password', async (req, res) => {
//   try {
//     const Mail = req.body.Mail;
//     const newPassword = req.body.newPassword;

//     // Update the password in the database
//     const user = await AccountCustomer.find({ Mail });
//     await AccountCustomer.updateOne({ Mail }, { $set: { password: newPassword } });

//     if (!user) {
//       // If the user with the specified email is not found
//       return res.status(404).json({ error: 'User not found' });
//     }
//     else {
//       res.send({ message: 'Password updated successfully' });
//     }

//     // Send a success response
//     res.json({ message: ' Password updated successfully' });
//   } catch (error) {
//     console.error('Error updating password:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

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
    const deletedAccount = await AccountCustomer.findByIdAndDelete(accountId);

    if (!deletedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }

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

// Đường dẫn PATCH để cập nhật userids cho một mã giảm giá dựa trên code
router.patch('/discount/:code', async (req, res) => {
  try {
    // Tìm mã giảm giá theo code
    const discount = await Discount.findOne({ code: req.params.code });

    // Kiểm tra xem có tìm thấy mã giảm giá hay không
    if (!discount) {
      return res.status(404).json({ error: 'Không tìm thấy mã giảm giá' });
    }

    // Cập nhật userids dựa trên req.body.userid
    if (req.body.userid) {
      // Kiểm tra xem userid có trong mảng userids chưa
      if (!discount.userids.find(user => user.userid === req.body.userid)) {
        discount.userids.push({ userid: req.body.userid });
      }
    }

    // Lưu lại mã giảm giá đã cập nhật
    const updatedDiscount = await discount.save();

    res.json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trang tài khoản bên client
// GET thông tin của một accountcustomer dựa trên id
router.get('/my-account/:id', async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await AccountCustomer.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Trả về thông tin cần thiết
    const accountInfo = {
      _id: account._id,
      nickname: account.nickname,
      Name: account.Name,
      phonenumber: account.phonenumber,
      Mail: account.Mail,
      gender: account.gender,
      dob: account.dob,
      avatar: account.avatar,
      userid: account.userid,
      addresses: account.addresses,
    };

    res.json(accountInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT để cập nhật thông tin của một accountcustomer
router.put('/my-account/:id', async (req, res) => {
  try {
    const accountId = req.params.id;
    const updatedInfo = req.body; // Body của yêu cầu sẽ chứa các thông tin cần cập nhật

    const account = await AccountCustomer.findByIdAndUpdate(accountId, updatedInfo, { new: true });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST để thêm địa chỉ mới
router.post('/add-address/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { province, district, addressDetail } = req.body;

  try {
    // Tìm tài khoản theo userId
    const account = await AccountCustomer.findOne({ _id: userId });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Thêm địa chỉ mới vào danh sách địa chỉ của tài khoản
    account.addresses.push({
      province: province,
      district: district,
      addressDetail: addressDetail,
      isDefault: false,
    });

    // Lưu tài khoản sau khi thêm địa chỉ mới
    const updatedAccount = await account.save();

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Chỉnh sửa địa chỉ theo userId và index của địa chỉ
router.put('/edit-address/:userId/:index', async (req, res) => {
  const userId = req.params.userId;
  const index = req.params.index;
  const { province, district, addressDetail } = req.body;

  try {
    const account = await AccountCustomer.findOne({ _id: userId });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Kiểm tra xem index có hợp lệ không
    if (index < 0 || index >= account.addresses.length) {
      return res.status(400).json({ error: 'Invalid address index' });
    }

    // Chỉnh sửa địa chỉ theo index
    const addressToUpdate = account.addresses[index];
    addressToUpdate.province = province;
    addressToUpdate.district = district;
    addressToUpdate.addressDetail = addressDetail;

    // Lưu tài khoản sau khi chỉnh sửa địa chỉ
    const updatedAccount = await account.save();

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Xoá địa chỉ theo userId và index của địa chỉ
router.delete('/delete-address/:userId/:index', async (req, res) => {
  const userId = req.params.userId;
  const index = req.params.index;

  try {
    const account = await AccountCustomer.findOne({ _id: userId });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Kiểm tra xem index có hợp lệ không
    if (index < 0 || index >= account.addresses.length) {
      return res.status(400).json({ error: 'Invalid address index' });
    }

    // Xoá địa chỉ theo index
    account.addresses.splice(index, 1);

    // Lưu tài khoản sau khi xoá địa chỉ
    const updatedAccount = await account.save();

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Đặt địa chỉ làm mặc định theo userId và index của địa chỉ
router.put('/set-default-address/:userId/:index', async (req, res) => {
  const userId = req.params.userId;
  const index = req.params.index;

  try {
    const account = await AccountCustomer.findOne({ _id: userId });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Kiểm tra xem index có hợp lệ không
    if (index < 0 || index >= account.addresses.length) {
      return res.status(400).json({ error: 'Invalid address index' });
    }

    // Đặt địa chỉ làm mặc định
    const selectedAddress = account.addresses[index];
    account.addresses.forEach(address => {
      address.isDefault = false;
    });
    selectedAddress.isDefault = true;

    // Lưu tài khoản sau khi đặt địa chỉ làm mặc định
    const updatedAccount = await account.save();

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
