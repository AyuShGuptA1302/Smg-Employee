const mongoose = require('mongoose');

const welfareProgramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Health Insurance', 'Wellness Programs', 'Emergency Support', 'Education Support', 'Family Benefits', 'Recreation'], required: true },
    description: { type: String, required: true },
    eligibility: { type: String },
    benefits: [String],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    contactPerson: { type: String },
    contactEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('WelfareProgram', welfareProgramSchema);
