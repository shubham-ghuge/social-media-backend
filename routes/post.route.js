const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Notification = require('../models/notification.model');
const { authHandler } = require('../middlewares/auth.middleware');
const { sanitizeResponse } = require('./utils');

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await User.findById(userId).populate('posts').exec();
            sanitizeResponse(response, '__v', 'password', 'followers')
            res.status(200).json({ success: false, message: 'post data', response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: 'error while retrieving post data' });
        }
    })
    .post(authHandler, async (req, res) => {
        const { userId } = req.user;
        const { text } = req.body;
        try {
            const response = await Post.create({ text });
            await User.findByIdAndUpdate(userId, { $push: { posts: response._id } });
            await Notification.findOneAndUpdate({ userId }, { $push: { text: 'post is uploaded' } });
            res.status(201).json({ success: true, postId: response._id, message: 'your posted' });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while uploading a post" });
        }
    })

router.route('/:postId')
    .get(authHandler, async (req, res) => {
        const { postId } = req.params;
        try {
            const response = await Post.findById(postId).populate('comments');
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while getting the data" });
        }
    })

module.exports = router;