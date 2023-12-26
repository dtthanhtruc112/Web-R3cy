const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customProductSchema = new mongoose.Schema({
  Name: String,
  phonenumber: String,
  Mail: String,
  pname: String,
  pdes: String,
  pfile: String
});
const CustomProduct = mongoose.model('CustomProduct', customProductSchema);

module.exports = CustomProduct;
