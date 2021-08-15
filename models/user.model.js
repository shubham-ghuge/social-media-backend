const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowerCase: true
    },
    password: String,
    bio: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;