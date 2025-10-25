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

router.get('/', protect, async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username profilePicture').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching posts.' });
    }
});

router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.status(200).json({ likes: post.likes, likeCount: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error while toggling like.' });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username profilePicture');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching post.' });
    }
});

module.exports = router;
