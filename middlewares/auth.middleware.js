const jwt = require('jsonwebtoken');

const authHandler = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = { userId: decoded.userId };
        return next();
    } catch (error) {
        res.status(401).json({ success: false, message: "unauthorized access please add the token" });
    }
}

module.exports = { authHandler };