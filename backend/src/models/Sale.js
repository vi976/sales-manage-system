const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  'Transaction ID': { type: String, required: true, index: true },
  'Date': { type: Date, required: true, index: true },
  'Customer ID': { type: String, required: true, index: true },
  'Customer Name': { type: String, required: true, index: true },
  'Phone Number': { type: String, required: true, index: true },
  'Gender': { type: String, required: true, index: true },
  'Age': { type: Number, required: true, index: true },
  'Customer Region': { type: String, required: true, index: true },
  'Customer Type': String,
  'Product ID': { type: String, index: true },
  'Product Name': String,
  'Brand': String,
  'Product Category': { type: String, required: true, index: true },
  'Tags': { type: [String], index: true },
  'Quantity': { type: Number, required: true },
  'Price per Unit': { type: Number, required: true },
  'Discount Percentage': { type: Number, default: 0 },
  'Total Amount': { type: Number, required: true },
  'Final Amount': { type: Number, required: true },
  'Payment Method': { type: String, required: true, index: true },
  'Order Status': String,
  'Delivery Type': String,
  'Store ID': String,
  'Store Location': String,
  'Salesperson ID': String,
  'Employee Name': { type: String, index: true }
}, {
  collection: 'sales',
  timestamps: false
});

// Create compound indexes for common query patterns
saleSchema.index({ 'Customer Name': 'text', 'Phone Number': 'text' });
saleSchema.index({ 'Date': 1, 'Customer Region': 1 });
saleSchema.index({ 'Product Category': 1, 'Gender': 1 });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;

