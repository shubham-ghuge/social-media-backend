const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
    text: [String],
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Activity = mongoose.model('Activity', activitySchema)
module.exports = Activity;