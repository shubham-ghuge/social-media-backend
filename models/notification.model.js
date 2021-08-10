const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    notification: [{
        text: String,
        userData: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;