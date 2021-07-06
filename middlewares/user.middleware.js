const User = require('../models/user.model');

async function isValidRegisterData(req, res, next) {
    const userDetails = req.body;
    const { name, email, password } = userDetails || {};
    if (name && email && password) {
        try {
            const checkEmail = await User.findOne({ email });
            if (checkEmail) {
                res.json({ message: "email id already exist" });
            } else {
                next();
            }
        } catch (error) {
            console.log("error in registration middleware", error);
            res.json({ message: "error at backend" })
        }
    } else {
        res.json({ message: "insuffiecient data" });
    }
}
async function isValidLoginData(req, res, next) {
    const data = req.body;
    const { email, password } = data;
    if (email && password) {
        try {
            const checkUser = await User.findOne({ email });
            if (!checkUser) {
                res.json({ message: "user doesn't exist" });
            } else {
                req.user = { dbPassword: checkUser.password, userId: checkUser._id, userName: checkUser.name };
                next();
            }
        } catch (error) {
            console.log("error in login middleware", error);
            res.json({ message: "error at backend" })
        }
    } else {
        res.json({ message: "insufficient data" });
    }
}

async function isExistingFollower(req, res, next) {
    const { userId } = req.user;
    const { user } = req.body;
    try {
        const checkIfFollow = await User.findOne({ _id: user, followers: { $elemMatch: { "$in": userId } } });
        console.log(checkIfFollow)
        if (checkIfFollow === null) {
            next();
        } else {
            res.json({ success: false, message: "you are already following this user" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error while checking user data" });
    }
}

module.exports = { isValidLoginData, isValidRegisterData, isExistingFollower }