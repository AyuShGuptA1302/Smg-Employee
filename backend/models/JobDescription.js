const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
    jdId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    reportingTo: { type: String },
    location: { type: String },
    employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'], default: 'Full-Time' },
    summary: { type: String },
    responsibilities: [String],
    qualifications: [String],
    experience: { type: String },
    skillsRequired: [String],
    salaryRange: { min: Number, max: Number },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
