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

// BLOG 
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
  
  // // Middleware để xóa ảnh
  // const deleteImageMiddleware = async (req, res, next) => {
  //   try {
  //     const blogId = req.params.id;
  
  //     // Tìm blog trong cơ sở dữ liệu
  //     const blog = await Blog.findById(blogId);
  
  //     if (blog && blog.thumbnail) {
  //       const imagePath = path.join(__dirname, '../uploads/', blog.thumbnail);
  
  //       // Kiểm tra xem hình ảnh có được sử dụng cho nhiều blog hay không
  //       const isImageUsed = await Blog.findOne({ thumbnail: blog.thumbnail, _id: { $ne: blogId } });
  
  //       // Nếu hình ảnh không được sử dụng cho bất kỳ blog nào khác, thì mới xóa
  //       if (!isImageUsed) {
  //         // Sử dụng Promise để bao bọc fs.unlink
  //         const unlinkPromise = () => {
  //           return new Promise((resolve, reject) => {
  //             fs.unlink(imagePath, (err) => {
  //               if (err) {
  //                 console.error('Error deleting image:', err);
  //                 reject(err);
  //               } else {
  //                 console.log(`Deleted image: ${imagePath}`);
  //                 resolve();
  //               }
  //             });
  //           });
  //         };
  
  //         // Sử dụng await để đợi promise hoàn thành
  //         await unlinkPromise();
  //       } else {
  //         console.log('Image is used by other blogs. Do not delete.');
  //       }
  //     } else {
  //       console.log('No image to delete.');
  //     }
  
  //     // Gọi next mà không truyền tham số để báo hiệu kết thúc middleware
  //     next();
  //   } catch (err) {
  //     console.error('Error during deleteImageMiddleware:', err);
  //     // Gọi next với tham số để báo hiệu có lỗi và kết thúc middleware
  //     next(err);
  //   }
  // };
  // Middleware để xóa ảnh
const deleteImageMiddleware = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    // Tìm blog trong cơ sở dữ liệu
    const blog = await Blog.findById(blogId);

    if (blog && blog.thumbnail) {
      // Kiểm tra xem có hình ảnh mới được tải lên không
      const isImageUpdated = req.file && req.file.path;

      // Nếu không có hình ảnh mới, chỉ cập nhật thông tin blog
      if (!isImageUpdated) {
        console.log('No image update. Skipping image deletion.');
        return next();
      }

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
  router.patch('/blog/:id', upload.single('thumbnail'), deleteImageMiddleware, async (req, res) => {
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
  
// router.use(deleteImageMiddleware);
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

  module.exports = router
  
  
    
  
  