const express = require('express');
const router = express.Router();
const { authHandler } = require('../middlewares/auth.middleware');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

router.route('/')
    .post(authHandler, async (req, res) => {
        const { userId } = req.user;
        const { text, postId, author } = req.body;
        try {
            const response = await Comment.create({ text, userId })
            await Post.findByIdAndUpdate(postId, { $push: { comments: response._id } });
            await Notification.findOneAndUpdate({ userId: author }, { $push: { notification: { text: "left a comment on your post", userData:userId } } });
            await Activity.findOneAndUpdate({ userId }, { $push: { text: "you commented on a post" } });
            res.json({ success: true, message: "you commented on a post" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while adding comment" })
        }
    })

module.exports = router
