const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    default: 'user',
  },
  userid: {
    type: Number,
  },
  gender: {
    type: String,
    default: null,
  },
  dob: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  addresses: [
    {
      country: { type: String, default: 'Việt Nam' },
      postcodeZip: { type: String, default: '' },
      province: { type: String },
      district: { type: String },
      addressDetail: { type: String },
      isDefault: { type: Boolean, default: false },
    },
  ],
});

accountCustomerSchema.plugin(AutoIncrement, { inc_field: 'userid', start_seq: 1 });

// Sử dụng hook 'pre' để thực hiện logic tăng giảm chỉ số và quản lý địa chỉ mặc định
accountCustomerSchema.pre('save', async function (next) {
  if (!this.userid) {
    const maxUserId = await mongoose.model('AccountCustomer').findOne({}, { userid: 1 }, { sort: { userid: -1 } });
    this.userid = maxUserId ? maxUserId.userid + 1 : 1;
  }

  // Kiểm tra xem có địa chỉ mặc định không, nếu không thì đặt là địa chỉ đầu tiên làm mặc định
  if (!this.addresses.some(address => address.isDefault) && this.addresses.length > 0) {
    this.addresses[0].isDefault = true;
  }

  // Chỉ giữ lại địa chỉ đầu tiên nếu có nhiều địa chỉ được đặt làm mặc định
  this.addresses = [this.addresses[0]];

  next();
});

const AccountCustomer = mongoose.model('AccountCustomer', accountCustomerSchema);

module.exports = AccountCustomer;