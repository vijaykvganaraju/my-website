const mongoose = require('mongoose');
const marked = require('marked');



const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: Array, required: true },
    slug: { type: String, required: true, unique: true },
    prev: { title: { type: String, default: '' } , slug: { type: String, default: '' } },
    next: { title: { type: String, default: '' }, slug: { type: String, default: '' } }
});

module.exports = mongoose.model('Blog', blogSchema);