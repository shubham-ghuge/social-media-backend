const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(8);
const { isValidLoginData, isValidRegisterData, isExistingFollower } = require('../middlewares/user.middleware');
const User = require('../models/user.model');
const { authHandler } = require('../middlewares/auth.middleware');
const Notification = require('../models/notification.model');

router.route("/")
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const users = await User.find({}).lean();
            const following = await User.findById(userId);
            const followingArr = following.followers;
            const response = users.map(user => {
                if (followingArr.includes(user._id)) {
                    return { name: user.name, _id: user._id, following: true }
                }
                return { name: user.name, _id: user._id, following: false }
            })
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.log("error in retrieving user data", error);
            res.json({ success: false, message: "something went wrong while retrieving user data" })
        }
    })

router.route('/profile')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        try {
            const response = await User.findById(userId);
            response.password = undefined;
            response.__v = undefined;
            res.status(200).json({ success: true, response, message: "data retrieved" });
        } catch (error) {
            console.log("error in retrieving user data", error);
            res.json({ success: false, message: "something went wrong while retrieving user data" })
        }
    })

router.route('/followers')
    .post(authHandler, isExistingFollower, async (req, res) => {
        const { userId } = req.user;
        const { user } = req.body;
        try {
            await User.findByIdAndUpdate(user, { $push: { followers: userId } });
            await Notification.findOneAndUpdate({ userId }, { $push: { text: "you followed a new person" } });
            await Notification.findOneAndUpdate({ userId: user }, { $push: { text: "somebody followed you person" } });
            res.status(201).json({ success: true, message: "you followed a new person" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Error while updating the follower list" })
        }
    });

router.route('/register')
    .post(isValidRegisterData, async (req, res) => {
        const userDetails = req.body;
        const { name, email, password } = userDetails;
        try {
            const hashedPassword = bcrypt.hashSync(password, salt);
            const response = await User.create({ name, email, password: hashedPassword });
            await Notification.create({ userId: response._id });
            res.status(201).json({ success: true, message: "registration successful" });
        } catch (error) {
            console.log("error in registration", error);
            res.json({ success: false, message: "couldn't register you,please try again!" })
        }
    })

router.route('/login')
    .post(isValidLoginData, async (req, res) => {
        const { dbPassword, userId, userName } = req.user;
        const { password } = req.body;
        try {
            const isValidUser = bcrypt.compareSync(password, dbPassword);
            if (isValidUser) {
                const token = jwt.sign({ userId }, process.env['secret_key'], { expiresIn: '24h' });
                res.status(200).json({ success: true, message: "user loggin successful", token, userName });
            } else {
                res.json({ success: false, message: "That didn't worked, please try again!" })
            }
        } catch (error) {
            console.log("error in login", error);
            res.json({ success: false, message: "error while logging in" })
        }
    })

module.exports = router;