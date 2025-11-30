const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { caption, language, code } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        if (!image && (!language || !code)) {
            return res.status(400).json({ message: 'Provide an image/caption or language+code.' });
        }

        const newPost = new Post({
            caption,
            language: language || undefined,
            code: code || undefined,
            image,
            author: req.user.id
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Create post error', error);
        res.status(500).json({ message: 'Server error while creating post.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { mine, user } = req.query;
        let filter = {};
        if (mine === 'true' && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const jwt = require('jsonwebtoken');
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                filter.author = decoded.id || decoded._id || decoded.userId || decoded.sub;
            } catch (e) {}
        } else if (user) {
            filter.author = user;
        }
        const posts = await Post.find(filter).sort({ createdAt: -1 }).populate('author', 'username profilePicture').lean();

        let currentUserId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const jwt = require('jsonwebtoken');
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                currentUserId = decoded.id || decoded._id || decoded.userId || decoded.sub;
            } catch (e) {}
        }

        const data = posts.map(p => {
            const likes = Array.isArray(p.likes) ? p.likes : [];
            return {
                ...p,
                likes: likes.length,
                commentsCount: p.commentCount || 0,
                isLiked: currentUserId ? likes.map(l => l.toString()).includes(currentUserId.toString()) : false
            };
        });

        res.status(200).json({ posts: data });
    } catch (error) {
        console.error('Fetch posts err', error);
        res.status(500).json({ message: 'Server error while fetching posts.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username profilePicture');
        if (!post) return res.status(404).json({ message: 'Post not found.' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching post.' });
    }
});

router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        const userId = req.user.id || req.user._id || req.user.userId;
        const already = post.likes.some(l => l.toString() === userId.toString());
        if (already) {
            post.likes = post.likes.filter(l => l.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.json({ likes: post.likes.length, liked: !already });
    } catch (error) {
        console.error('Like error', error);
        res.status(500).json({ message: 'Server error while toggling like.' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });
        if (post.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post.' });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting post.' });
    }
});

module.exports = router;
