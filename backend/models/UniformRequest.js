const mongoose = require('mongoose');

const uniformRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: String, required: true, unique: true },
    items: [{
        name: String,
        size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        quantity: Number
    }],
    status: { type: String, enum: ['Pending', 'Approved', 'Dispatched', 'Delivered', 'Rejected'], default: 'Pending' },
    approver: { type: String },
    deliveryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UniformRequest', uniformRequestSchema);
