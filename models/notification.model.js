const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    text: [String],
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;