const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    year: { type: Number, required: true },
    annualTotal: { type: Number, default: 20 },
    annualUsed: { type: Number, default: 0 },
    sickTotal: { type: Number, default: 10 },
    sickUsed: { type: Number, default: 0 },
    casualTotal: { type: Number, default: 8 },
    casualUsed: { type: Number, default: 0 }
}, { timestamps: true });

leaveBalanceSchema.index({ user: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
