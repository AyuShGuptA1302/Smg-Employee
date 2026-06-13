const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    interviewId: { type: String, required: true, unique: true },
    candidateName: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    interviewDate: { type: Date, required: true },
    interviewers: [String],
    rounds: [{
        roundName: String,
        score: { type: Number, min: 0, max: 10 },
        remarks: String,
        result: { type: String, enum: ['Pass', 'Fail', 'On Hold'] }
    }],
    overallScore: { type: Number },
    recommendation: { type: String, enum: ['Strongly Recommend', 'Recommend', 'Not Recommend', 'On Hold'], default: 'On Hold' },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'], default: 'Scheduled' },
    mrf: { type: mongoose.Schema.Types.ObjectId, ref: 'MRF' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
