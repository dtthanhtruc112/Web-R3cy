const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Blog = new Schema({
    blogid: { type: Number, required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true }
});

module.exports = mongoose.model('Blog', Blog);
