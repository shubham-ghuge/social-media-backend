const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');
const { authHandler } = require('../middlewares/auth.middleware')

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await Notification.findOne({ userId });
            res.json({ success: true, response });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while retrieving data" });
        }
    })
    .post(authHandler, async (req, res) => {
        const { userId } = req.user;
        const { message } = req.body;
        try {
            const response = await Notification.findByIdAndUpdate(userId, { $push: { notification: message } });
            console.log(response);
            res.json({ success: true, message: "notification added" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while adding notification" })
        }
    })

module.exports = router