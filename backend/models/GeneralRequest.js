const mongoose = require('mongoose');

const generalRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reqId: { type: String, required: true, unique: true },
    category: { type: String, enum: ['Facilities', 'IT Support', 'HR Query', 'Other'], required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'], default: 'Pending' },
    assignedTo: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('GeneralRequest', generalRequestSchema);
