const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    department: { type: String, default: 'All' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    attachments: [String]
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
