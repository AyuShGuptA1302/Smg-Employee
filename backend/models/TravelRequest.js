const mongoose = require('mongoose');

const travelRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: String, required: true, unique: true },
    travelType: { type: String, enum: ['Domestic', 'International', 'Local'], required: true },
    purpose: { type: String, required: true },
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    travelMode: { type: String, enum: ['Flight', 'Train', 'Bus', 'Car', 'Self'], default: 'Train' },
    accommodation: { type: Boolean, default: false },
    estimatedCost: { type: Number },
    advanceRequired: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Reimbursed'], default: 'Pending' },
    approver: { type: String },
    expenses: [{
        category: { type: String, enum: ['Travel', 'Hotel', 'Food', 'Conveyance', 'Miscellaneous'] },
        description: String,
        amount: Number,
        receiptAttached: { type: Boolean, default: false }
    }],
    totalExpense: { type: Number, default: 0 },
    reimbursedAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TravelRequest', travelRequestSchema);
