const mongoose = require('mongoose');

const guestHouseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: String, required: true, unique: true },
    guestName: { type: String, required: true },
    guestCompany: { type: String },
    purpose: { type: String, required: true },
    roomType: { type: String, enum: ['Single', 'Double', 'Suite', 'Dormitory'], default: 'Single' },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: { type: Number, default: 1 },
    meals: { type: Boolean, default: true },
    specialRequirements: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Checked In', 'Checked Out', 'Cancelled'], default: 'Pending' },
    approver: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GuestHouse', guestHouseSchema);
