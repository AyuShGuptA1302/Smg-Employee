const mongoose = require('mongoose');

// Generic department data store - replaces localStorage-based useDataStore
// Each department portal stores its data here (budgets, events, vendors, etc.)
const departmentDataSchema = new mongoose.Schema({
    storeKey: { type: String, required: true, index: true },  // e.g., "finance:budget", "event:events"
    items: { type: mongoose.Schema.Types.Mixed, default: [] },
    department: { type: String, index: true },
    lastUpdatedBy: { type: String },
}, { timestamps: true });

departmentDataSchema.index({ storeKey: 1 }, { unique: true });

module.exports = mongoose.model('DepartmentData', departmentDataSchema);
