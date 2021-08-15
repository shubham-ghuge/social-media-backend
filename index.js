const express = require("express");
const cors = require("cors");
const app = express();
const port = 3002;
const { initialiseDbConnection } = require('./db/connection.db');
const userRoute = require('./routes/user.route');
const postRoute = require('./routes/post.route');
const notificationRoute = require('./routes/notification.route');
const commentRoute = require('./routes/comment.route');
const feedRoute = require('./routes/feed.route');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

app.use(cors());
app.use(express.json());
initialiseDbConnection();

app.get('/', (req, res) => {
    console.log(process.env)
    res.json({ message: "helloooooooo" });
})

app.use('/users', userRoute);
app.use('/posts', postRoute);
app.use('/comments', commentRoute);
app.use('/notifications', notificationRoute);
app.use('/feed', feedRoute);

app.use((req, res, next) => {
    console.log(req)
    res.status(404).json({ success: false, message: "Invalid Route" });
})

app.listen(process.env.PORT || port, () => {
    console.log("server started at port", port)
})