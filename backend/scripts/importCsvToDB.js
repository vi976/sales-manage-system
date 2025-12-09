require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Sale = require('../src/models/Sale');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salesdb';
const CSV_PATH = path.join(__dirname, '..', 'output_50k.csv');

// Helper function to parse tags (comma-separated string to array)
function parseTags(tagsStr) {
  if (!tagsStr || tagsStr.trim() === '') return [];
  return tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

// Helper function to parse date
function parseDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Helper function to parse number
function parseNumber(numStr) {
  if (!numStr || numStr.trim() === '') return 0;
  const num = parseFloat(numStr);
  return isNaN(num) ? 0 : num;
}

async function importCsvToDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to append)
    console.log('Clearing existing sales data...');
    await Sale.deleteMany({});
    console.log('Existing data cleared');

    const sales = [];
    let rowCount = 0;

    console.log(`Reading CSV file: ${CSV_PATH}`);
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on('data', (row) => {
          rowCount++;
          
          // Convert fields to proper types
          const saleData = {
            'Transaction ID': String(row['Transaction ID'] || ''),
            'Date': parseDate(row['Date']),
            'Customer ID': String(row['Customer ID'] || ''),
            'Customer Name': String(row['Customer Name'] || ''),
            'Phone Number': String(row['Phone Number'] || ''),
            'Gender': String(row['Gender'] || ''),
            'Age': parseNumber(row['Age']),
            'Customer Region': String(row['Customer Region'] || ''),
            'Customer Type': String(row['Customer Type'] || ''),
            'Product ID': String(row['Product ID'] || ''),
            'Product Name': String(row['Product Name'] || ''),
            'Brand': String(row['Brand'] || ''),
            'Product Category': String(row['Product Category'] || ''),
            'Tags': parseTags(row['Tags'] || ''),
            'Quantity': parseNumber(row['Quantity']),
            'Price per Unit': parseNumber(row['Price per Unit']),
            'Discount Percentage': parseNumber(row['Discount Percentage']),
            'Total Amount': parseNumber(row['Total Amount']),
            'Final Amount': parseNumber(row['Final Amount']),
            'Payment Method': String(row['Payment Method'] || ''),
            'Order Status': String(row['Order Status'] || ''),
            'Delivery Type': String(row['Delivery Type'] || ''),
            'Store ID': String(row['Store ID'] || ''),
            'Store Location': String(row['Store Location'] || ''),
            'Salesperson ID': String(row['Salesperson ID'] || ''),
            'Employee Name': String(row['Employee Name'] || '')
          };

          sales.push(saleData);

          // Batch insert every 1000 records
          if (sales.length >= 1000) {
            const batch = sales.splice(0, 1000);
            Sale.insertMany(batch, { ordered: false })
              .then(() => {
                console.log(`Inserted ${rowCount} rows...`);
              })
              .catch((err) => {
                console.error(`Error inserting batch at row ${rowCount}:`, err.message);
              });
          }
        })
        .on('end', async () => {
          try {
            // Insert remaining records
            if (sales.length > 0) {
              console.log(`Inserting final batch of ${sales.length} records...`);
              await Sale.insertMany(sales, { ordered: false });
            }

            console.log(`\nImport completed! Total rows processed: ${rowCount}`);
            console.log('Creating indexes...');

            // Create indexes
            await Sale.collection.createIndex({ 'Customer Name': 1 });
            await Sale.collection.createIndex({ 'Phone Number': 1 });
            await Sale.collection.createIndex({ 'Customer Region': 1 });
            await Sale.collection.createIndex({ 'Gender': 1 });
            await Sale.collection.createIndex({ 'Age': 1 });
            await Sale.collection.createIndex({ 'Product Category': 1 });
            await Sale.collection.createIndex({ 'Tags': 1 });
            await Sale.collection.createIndex({ 'Payment Method': 1 });
            await Sale.collection.createIndex({ 'Date': 1 });
            await Sale.collection.createIndex({ 'Customer Name': 'text', 'Phone Number': 'text' });
            await Sale.collection.createIndex({ 'Date': 1, 'Customer Region': 1 });
            await Sale.collection.createIndex({ 'Product Category': 1, 'Gender': 1 });

            console.log('Indexes created successfully');
            console.log('\nVerifying data...');
            const count = await Sale.countDocuments();
            console.log(`Total documents in database: ${count}`);

            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            resolve();
          } catch (err) {
            console.error('Error during final insert or indexing:', err);
            await mongoose.connection.close();
            reject(err);
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err);
          mongoose.connection.close();
          reject(err);
        });
    });
  } catch (error) {
    console.error('Import error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the import
importCsvToDB()
  .then(() => {
    console.log('Import script completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Import script failed:', err);
    process.exit(1);
  });

