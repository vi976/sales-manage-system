const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_PATH = path.join(__dirname, '..','..','output_50k.csv');

function loadSalesData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

module.exports = { loadSalesData };
