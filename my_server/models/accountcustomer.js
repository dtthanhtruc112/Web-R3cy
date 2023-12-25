// const AccountCustomer = mongoose.model('AccountCustomer', {
//     Name: String,
//     phonenumber: String,
//     Mail: String,
//     password: String
//   });

const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
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
  userid: {
    type: Number,
  },
});
// accountCustomerSchema.plugin(AutoIncrement, { inc_field: 'userid', start_seq: 1 });

// Sử dụng hook 'pre' để thực hiện logic tăng giảm chỉ số trước khi lưu vào cơ sở dữ liệu
accountCustomerSchema.pre('save', async function (next) {
  if (!this.userid) {
    // Nếu userid không tồn tại, thực hiện logic tăng giảm chỉ số
    const maxUserId = await mongoose.model('AccountCustomer').findOne({}, { userid: 1 }, { sort: { userid: -1 } });
    this.userid = maxUserId ? maxUserId.userid + 1 : 1;
  }

  next();
});



const AccountCustomer = mongoose.model('AccountCustomer', accountCustomerSchema);

// Xuất model
module.exports = AccountCustomer;