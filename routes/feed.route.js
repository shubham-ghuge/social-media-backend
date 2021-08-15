const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { authHandler } = require('../middlewares/auth.middleware');

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const { followers } = await User.findById(userId).populate({ path: 'followers', populate: { path: 'posts' } }).exec();
            const response = followers.map(({ name, _id, posts }) => ({ name, _id, posts }));
            res.status(200).json({ success: false, message: 'post data', response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: 'error while retrieving post data' });
        }
    })

module.exports = router;