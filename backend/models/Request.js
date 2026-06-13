const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reqId: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // e.g., 'Leave Application', 'Reimbursement'
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'In Progress'], default: 'Pending' },
    approver: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
