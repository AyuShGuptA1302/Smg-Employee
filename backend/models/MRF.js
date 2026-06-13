const mongoose = require('mongoose');

const mrfSchema = new mongoose.Schema({
    mrfId: { type: String, required: true, unique: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    jobTitle: { type: String, required: true },
    numberOfPositions: { type: Number, default: 1 },
    employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'], default: 'Full-Time' },
    experience: { type: String },
    qualification: { type: String },
    skills: [String],
    budgetRange: { min: Number, max: Number },
    justification: { type: String, required: true },
    replacementFor: { type: String },
    expectedJoiningDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: { type: String, enum: ['Draft', 'Pending Approval', 'Approved', 'In Recruitment', 'Filled', 'Cancelled'], default: 'Draft' },
    approver: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MRF', mrfSchema);
