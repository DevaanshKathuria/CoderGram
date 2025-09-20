const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    const { caption, language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ message: 'Language and code fields are required.' });
    }

    try {
        const newPost = new Post({
            caption,
            language,
            code,
            author: req.user.id,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(500).json({ message: 'Server error while creating post.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching posts.' });
    }
});

module.exports = router;
