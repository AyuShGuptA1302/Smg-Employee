const mongoose = require('mongoose');

const attendanceMissSlipSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slipId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    missType: { type: String, enum: ['Check-In Missing', 'Check-Out Missing', 'Both Missing', 'Wrong Punch'], required: true },
    actualCheckIn: { type: String },
    actualCheckOut: { type: String },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approver: { type: String },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceMissSlip', attendanceMissSlipSchema);
