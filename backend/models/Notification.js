const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['success', 'info', 'warning', 'error'], default: 'info' },
    category: { type: String, enum: ['Leave', 'Training', 'Payroll', 'System', 'Announcement', 'Request', 'Other', 'Gate Pass'], default: 'Other' },
    isRead: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
