const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assetId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Mobile', 'Tablet', 'Printer', 'Other'], required: true },
    brand: { type: String },
    serialNumber: { type: String },
    condition: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'], default: 'Good' },
    assignedDate: { type: Date },
    returnDate: { type: Date },
    status: { type: String, enum: ['Available', 'Assigned', 'Under Repair', 'Disposed'], default: 'Available' }
}, { timestamps: true });

const assetRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: String, required: true, unique: true },
    assetType: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    justification: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Fulfilled'], default: 'Pending' },
    approver: { type: String },
    fulfilledAsset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);
const AssetRequest = mongoose.model('AssetRequest', assetRequestSchema);

module.exports = { Asset, AssetRequest };
