const mongoose = require('mongoose');

const simRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: String, required: true, unique: true },
    planType: { type: String, enum: ['Basic Plan', 'Premium Plan'], required: true },
    simNumber: { type: String },
    purpose: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Activated', 'Deactivated', 'Rejected'], default: 'Pending' },
    activatedOn: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SIMRequest', simRequestSchema);
