const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');
const { authHandler } = require('../middlewares/auth.middleware');
const Activity = require('../models/activity.model');

router.route('/')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const { notification } = await Notification.findOne({ userId }).populate({ path: 'notification', populate: { path: 'userData' } });
            const activityResponse = await Activity.findOne({ userId });
            const notificationData = notification.map(i => ({ text: i.text, name: i.userData.name, _id: i.userData._id }))
            res.json({ success: true, notification: notificationData, activity: activityResponse });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "error while retrieving data" });
        }
    })

module.exports = router