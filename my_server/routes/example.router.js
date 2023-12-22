const express = require('express')
const router = express.Router();

const Order = require('../models/order')
const User = require('../models/user')
const Blog = require('../models/blog')
const AccountCustomer = require('../models/accountcustomer.js');
const cors = require('cors');
// 
router.get('/', (req, res) => {
    res.send('Welcome to NodeJS');
})

const bodyParser = require('body-parser');
router.use(bodyParser.json());



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


// BLOG 

// API để tạo blog trong admin
router.post('/createBlog', async (req, res) => {
    try {
      const newBlog = new Blog({
        blogid: req.body.blogid,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        
      });
  
      const savedBlog = await newBlog.save();
      res.json(savedBlog);
    } catch (error) {
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
router.get('/blogs/latestBlogs', async (req, res) => {
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

// API để xóa blog theo id
router.delete('/blog/:id', async (req, res) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
      if (!deletedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json(deletedBlog);
    } catch (error) {
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


module.exports = router
