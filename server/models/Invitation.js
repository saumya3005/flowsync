const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    inviterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Developer', 'Viewer'],
      default: 'Viewer',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;
