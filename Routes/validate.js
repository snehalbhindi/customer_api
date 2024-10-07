const fs = require('fs');

// Validation Middleware
const validateCustomer = (req, res, next) => {
  const { first_name, last_name, city, company } = req.body;

  // Ensure all fields are provided
  if (!first_name || !last_name || !city || !company) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  // Ensure city and company exist in the dataset
  const customers = JSON.parse(fs.readFileSync('./customers.json'));
  const existingCity = customers.some(c => c.city === city);
  const existingCompany = customers.some(c => c.company === company);

  if (!existingCity || !existingCompany) {
    return res.status(400).json({ msg: 'City or company does not exist' });
  }

  next();
};

module.exports = validateCustomer;
