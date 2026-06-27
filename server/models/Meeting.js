const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    roomId: { type: String, required: true, unique: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);
module.exports = Meeting;
