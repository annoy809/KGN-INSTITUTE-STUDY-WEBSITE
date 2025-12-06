const mongoose = require('mongoose');



const announcementSchema = new mongoose.Schema({

  title: { type: String, required: true },

  content: { type: String, required: true },

  targetCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  status: { type: String, enum: ['draft', 'pending_approval', 'published', 'rejected', 'archived'], default: 'draft' },

  scheduleDate: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },

  rejectionReason: { type: String, default: null }

});



module.exports = mongoose.model('Announcement', announcementSchema);