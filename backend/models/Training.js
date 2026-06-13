const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    duration: { type: String, required: true },
    instructor: { type: String, required: true },
    type: { type: String, enum: ['Required', 'Optional'], default: 'Optional' },
    category: { type: String },
    department: { type: String },
    maxParticipants: { type: Number, default: 50 },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    completedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['Upcoming', 'In Progress', 'Completed', 'Cancelled'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);
