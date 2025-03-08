const mongoose = require('mongoose');

const FashionSchema = new mongoose.Schema({
    title: String,
    details: String,
    thumbnail: String,
    style: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fashion', FashionSchema);
