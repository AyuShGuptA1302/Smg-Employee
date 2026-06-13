const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Process', 'Product', 'Safety', 'Cost Saving', 'Other'], default: 'Other' },
    status: { type: String, enum: ['Submitted', 'Under Review', 'Approved', 'Implemented', 'Rejected'], default: 'Submitted' },
    votes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Idea', ideaSchema);
