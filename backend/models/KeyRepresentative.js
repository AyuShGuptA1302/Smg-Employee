const mongoose = require('mongoose');

const keyRepresentativeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
    responsibilities: [String],
    contactNumber: { type: String },
    email: { type: String },
    location: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('KeyRepresentative', keyRepresentativeSchema);
