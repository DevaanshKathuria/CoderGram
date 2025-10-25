const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// Get comments for a post
router.get('/post/:postId', protect, async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });
        
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching comments.' });
    }
});

// Create a comment
router.post('/', protect, async (req, res) => {
    const { text, postId } = req.body;

    if (!text || !postId) {
        return res.status(400).json({ message: 'Text and post ID are required.' });
    }

    try {
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const newComment = new Comment({
            text,
            author: req.user.id,
            post: postId,
        });

        const savedComment = await newComment.save();
        
        // Increment comment count on post
        post.commentCount += 1;
        await post.save();

        const populatedComment = await Comment.findById(savedComment._id)
            .populate('author', 'username profilePicture');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating comment.' });
    }
});

// Delete a comment
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment.' });
        }

        const post = await Post.findById(comment.post);
        if (post) {
            post.commentCount = Math.max(0, post.commentCount - 1);
            await post.save();
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting comment.' });
    }
});

module.exports = router;
