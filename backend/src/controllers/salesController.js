const { getFilteredSales } = require('../services/salesService');

async function getAllSales(req, res) {
  try {
    const query = req.query;
    const { results, total } = await getFilteredSales(query);
    res.json({ results, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process sales data', details: err.message });
  }
}

module.exports = { getAllSales };
