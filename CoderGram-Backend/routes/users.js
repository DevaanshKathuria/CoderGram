const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Post = require('../models/Post');

// Search users
router.get('/search', protect, async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        })
        .select('username profilePicture bio')
        .limit(20);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error while searching users.' });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/follow/:id', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (req.params.id === req.user.id) {
        return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ msg: 'You are already following this user' });
    }

    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user.id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ msg: 'User followed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/unfollow/:id', protect, async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (!userToUnfollow) {
        return res.status(404).json({ msg: 'User not found' });
      }

      if (!currentUser.following.includes(req.params.id)) {
        return res.status(400).json({ msg: 'You are not following this user' });
      }
      
      currentUser.following = currentUser.following.filter(
        (followingId) => followingId.toString() !== req.params.id
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (followerId) => followerId.toString() !== req.user.id
      );
  
      await currentUser.save();
      await userToUnfollow.save();
  
      res.json({ msg: 'User unfollowed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
