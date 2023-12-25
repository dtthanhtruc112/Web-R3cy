const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customProductSchema = new Schema({
  Name: { type: String, required: true },
  phonenumber: { type: String, required: true },
  Mail: { type: String, required: true },
  pname: { type: String, required: true },
  pdes: { type: String, required: true },
  pfile: { type: Buffer, required: true },  // Sửa kiểu dữ liệu nếu cần thiết
});

const CustomProduct = mongoose.model('CustomProduct', customProductSchema);

module.exports = CustomProduct;
