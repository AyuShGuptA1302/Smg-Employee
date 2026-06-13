const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
    type: { type: String, enum: ['work', 'break', 'overtime', 'late'] },
    width: String,
    color: String
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    day: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    duration: { type: String },
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Late', 'Half Day', 'Weekend', 'Holiday'], default: 'Present' },
    isLeave: { type: Boolean, default: false },
    segments: [segmentSchema],
    overtimeHours: { type: Number, default: 0 },
    lateMinutes: { type: Number, default: 0 }
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
