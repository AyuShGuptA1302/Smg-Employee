const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    passId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Personal', 'Official', 'Medical', 'Emergency'], required: true },
    outTime: { type: String, required: true },
    inTime: { type: String },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    approver: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GatePass', gatePassSchema);
