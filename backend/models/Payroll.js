const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },  // e.g., "November 2024"
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    grossSalary: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['Generated', 'Paid', 'On Hold'], default: 'Generated' },
    paidOn: { type: Date }
}, { timestamps: true });

payrollSchema.index({ user: 1, year: 1, month: 1 });

module.exports = mongoose.model('Payroll', payrollSchema);
