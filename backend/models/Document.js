const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ['Onboarding', 'Identity', 'Tax Documents', 'Certificates', 'Payroll', 'Policies', 'Other'], required: true },
    fileType: { type: String, default: 'PDF' },
    fileSize: { type: String },
    filePath: { type: String },
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

documentSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Document', documentSchema);
