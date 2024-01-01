

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountSchema = new mongoose.Schema({
  code: String,
  title: String,
  description: String,
  status: String,
  activate_date: String,
  expired_date: String,
  valuecode: Number,
  userids: [{
    userid: Number
  }

  ],
  createAt: { type: Date, default: Date.now }
});
const Discount = mongoose.model('Discount', DiscountSchema);

module.exports = Discount;
