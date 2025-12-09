const Sale = require('../models/Sale');

function caseInsensitiveIncludes(main, sub) {
  return main.toLowerCase().includes(sub.toLowerCase());
}

/**
 * Main function to get filtered sales from MongoDB.
 * query: {search, filters, sort, pagination params}
 * Returns: {results, total}
 */
async function getFilteredSales(query) {
  try {
    // Build MongoDB query
    const mongoQuery = {};

    // 1. Search - text search on Customer Name and Phone Number
    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim();
      mongoQuery.$or = [
        { 'Customer Name': { $regex: searchTerm, $options: 'i' } },
        { 'Phone Number': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // 2. Filters
    // Multi-select: Customer Region
    if (query.regions && query.regions.length > 0) {
      const regions = Array.isArray(query.regions) ? query.regions : query.regions.split(',');
      mongoQuery['Customer Region'] = { $in: regions };
    }

    // Multi-select: Gender
    if (query.genders && query.genders.length > 0) {
      const genders = Array.isArray(query.genders) ? query.genders : query.genders.split(',');
      mongoQuery['Gender'] = { $in: genders };
    }

    // Range: Age
    if (query.ageMin !== undefined && query.ageMin !== null && query.ageMin !== '') {
      mongoQuery['Age'] = { ...mongoQuery['Age'], $gte: Number(query.ageMin) };
    }
    if (query.ageMax !== undefined && query.ageMax !== null && query.ageMax !== '') {
      mongoQuery['Age'] = { ...mongoQuery['Age'], $lte: Number(query.ageMax) };
    }

    // Multi-select: Product Category
    if (query.categories && query.categories.length > 0) {
      const categories = Array.isArray(query.categories) ? query.categories : query.categories.split(',');
      mongoQuery['Product Category'] = { $in: categories };
    }

    // Multi-select: Tags (array contains any of the selected tags)
    if (query.tags && query.tags.length > 0) {
      const tags = Array.isArray(query.tags) ? query.tags : query.tags.split(',');
      mongoQuery['Tags'] = { $in: tags };
    }

    // Multi-select: Payment Method
    if (query.paymentMethods && query.paymentMethods.length > 0) {
      const paymentMethods = Array.isArray(query.paymentMethods) ? query.paymentMethods : query.paymentMethods.split(',');
      mongoQuery['Payment Method'] = { $in: paymentMethods };
    }

    // Date range
    if (query.dateFrom || query.dateTo) {
      mongoQuery['Date'] = {};
      if (query.dateFrom) {
        const startDate = new Date(query.dateFrom);
        startDate.setHours(0, 0, 0, 0);
        mongoQuery['Date'].$gte = startDate;
      }
      if (query.dateTo) {
        const endDate = new Date(query.dateTo);
        endDate.setHours(23, 59, 59, 999);
        mongoQuery['Date'].$lte = endDate;
      }
    }

    // Build sort object
    let sortObj = {};
    if (query.sortField) {
      const sortDir = query.sortDir === 'desc' ? -1 : 1;
      if (query.sortField === 'Date') {
        sortObj['Date'] = sortDir;
      } else if (query.sortField === 'Quantity') {
        sortObj['Quantity'] = sortDir;
      } else if (query.sortField === 'Customer Name') {
        sortObj['Customer Name'] = sortDir;
      }
    }

    // Get total count (before pagination)
    const total = await Sale.countDocuments(mongoQuery);

    // Pagination
    const page = query.page ? Number(query.page) : 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Execute query with pagination
    let queryBuilder = Sale.find(mongoQuery);

    // Apply sorting
    if (Object.keys(sortObj).length > 0) {
      queryBuilder = queryBuilder.sort(sortObj);
    }

    // Apply pagination
    const results = await queryBuilder
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    return { results, total };
  } catch (error) {
    console.error('Error in getFilteredSales:', error);
    throw error;
  }
}

module.exports = { getFilteredSales };
