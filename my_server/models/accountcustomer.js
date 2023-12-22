// const AccountCustomer = mongoose.model('AccountCustomer', {
//     Name: String,
//     phonenumber: String,
//     Mail: String,
//     password: String
//   });

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountCustomerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  Mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
});

const AccountCustomer = mongoose.model('AccountCustomer', accountCustomerSchema);

// Xuất model
module.exports = AccountCustomer;