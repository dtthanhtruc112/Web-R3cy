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


router.use(bodyParser.json({ limit: '10mb' })); // Hoặc giá trị lớn hơn tùy vào nhu cầu của bạn
router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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

// GET tất cả customer có role là 'user'

router.get('/customers', async (req, res) => {
  try {
    const customers = await AccountCustomer.find({ role: 'user' });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
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
module.exports = router