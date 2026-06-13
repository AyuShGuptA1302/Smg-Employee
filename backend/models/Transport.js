const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Pick-up', 'Drop', 'Round Trip', 'Outstation'], required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    passengers: { type: Number, default: 1 },
    purpose: { type: String },
    vehicleType: { type: String, enum: ['Car', 'Van', 'Bus'], default: 'Car' },
    status: { type: String, enum: ['Pending', 'Approved', 'Assigned', 'Completed', 'Cancelled'], default: 'Pending' },
    driverName: { type: String },
    vehicleNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
