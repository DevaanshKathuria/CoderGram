const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        trim: true,
    },
    language: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    code: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
