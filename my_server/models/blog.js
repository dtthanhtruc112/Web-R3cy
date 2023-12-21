const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Blog = new Schema({
    // blogid: { type: Number },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String },
    content: { type: String, required: true },
    thumbnail: { type: String }
});

module.exports = mongoose.model('Blog', Blog);
