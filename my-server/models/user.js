const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Address = new Schema({
    STT: { type: String },
    tendiachi: { type: String }
});

const User = new Schema({
    userid: { type: Number },
    tendangnhap: { type: String },
    hovaten: { type: String },
    email: { type: String },
    sdt: { type: String },  // Change type to String for phone number
    gioitinh: { type: String },
    ngaysinh: { type: String },
    hinhdaidien: { type: String },
    matkhau: { type: String },
    diachi: [Address]  // Embed the Address schema for the diachi array
});

module.exports = mongoose.model('User', User);
