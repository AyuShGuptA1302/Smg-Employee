const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    department: { type: String },
    status: { type: String, enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'], default: 'Planning' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    startDate: { type: Date },
    endDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    budget: { type: Number },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
