const mongoose = require('mongoose');

const canteenOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Placed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'], default: 'Placed' },
    paymentMode: { type: String, enum: ['Wallet', 'Cash', 'Deducted from Salary'], default: 'Wallet' }
}, { timestamps: true });

const canteenMenuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Beverages'], required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'All'], default: 'All' }
}, { timestamps: true });

const CanteenOrder = mongoose.model('CanteenOrder', canteenOrderSchema);
const CanteenMenu = mongoose.model('CanteenMenu', canteenMenuSchema);

module.exports = { CanteenOrder, CanteenMenu };
