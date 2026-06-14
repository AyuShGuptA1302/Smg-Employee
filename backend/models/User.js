const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    degree: String,
    institution: String,
    year: String,
    grade: String
}, { _id: false });

const certificationSchema = new mongoose.Schema({
    name: String,
    issuer: String,
    year: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'admin', 'superadmin', 'department'], default: 'employee' },
    empId: { type: String, required: true, unique: true },
    dept: { type: String, required: true },
    designation: { type: String },
    avatar: { type: String },
    shift: { type: String },
    reportingTo: { type: String },
    phone: { type: String },
    emergencyContact: { type: String },
    dateOfBirth: { type: String },
    dateOfJoining: { type: String },
    bloodGroup: { type: String },
    address: { type: String },
    education: [educationSchema],
    certifications: [certificationSchema],
    skills: [String],
    languages: [String],
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
