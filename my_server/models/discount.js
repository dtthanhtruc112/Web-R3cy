const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountSchema = new mongoose.Schema({
  Code: String,
  title: String,
  description: String,
  status: String,
  activate_date: String,
  createAt: { type: Date, default: Date.now }
});
const Discount = mongoose.model('Discount', DiscountSchema);

module.exports = Discount;
