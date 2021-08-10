const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');
const { authHandler } = require('../middlewares/auth.middleware');
const Activity = require('../models/activity.model');

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const { notification } = await Notification.findOne({ userId });
            const activityResponse = await Activity.findOne({ userId });
            res.json({ success: true, notification, activity: activityResponse });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while retrieving data" });
        }
    })

module.exports = router