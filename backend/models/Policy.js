const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Code of Conduct', 'Leave Policy', 'IT Security', 'HR Policies', 'Safety', 'Travel', 'Finance', 'Other'], required: true },
    content: { type: String, required: true },
    version: { type: String, default: '1.0' },
    effectiveDate: { type: Date },
    department: { type: String, default: 'All' },
    isActive: { type: Boolean, default: true },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
