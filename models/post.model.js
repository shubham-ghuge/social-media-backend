const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    text: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    support: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;