const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Blog = new Schema({
    blogid: { type: Number },
    title: { type: String },
    author: { type: String },
    date: {type: Date, default: Date.now},  
    content: { type: String },
    thumb: { type: String },
});

module.exports = mongoose.model('Blog', Blog);