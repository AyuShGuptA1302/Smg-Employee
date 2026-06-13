const mongoose = require('mongoose');

const resignationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resignationId: { type: String, required: true, unique: true },
    resignationDate: { type: Date, required: true },
    lastWorkingDate: { type: Date, required: true },
    noticePeriodDays: { type: Number, default: 30 },
    reason: { type: String, required: true },
    reasonCategory: { type: String, enum: ['Better Opportunity', 'Personal Reasons', 'Health Issues', 'Relocation', 'Higher Education', 'Retirement', 'Other'], required: true },
    feedbackForCompany: { type: String },
    status: { type: String, enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Withdrawn', 'Exit Completed'], default: 'Submitted' },
    exitInterviewDone: { type: Boolean, default: false },
    exitInterviewNotes: { type: String },
    clearanceStatus: {
        itAssets: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' },
        finance: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' },
        hr: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' },
        admin: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' },
        department: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' }
    },
    approver: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resignation', resignationSchema);
