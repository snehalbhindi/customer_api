const express = require('express');
const fs = require('fs');
const router = express.Router();
const validateCustomer = require('./validate');

// Read customer data from JSON file
const getCustomers = () => {
  const data = fs.readFileSync('./customers.json');
  return JSON.parse(data);
};

// 1. List customers with search and pagination
router.get('/', (req, res) => {
  const { first_name, last_name, city, page = 1, limit = 10 } = req.query;
  let customers = getCustomers();

  // Search filters
  if (first_name) customers = customers.filter(c => c.first_name === first_name);
  if (last_name) customers = customers.filter(c => c.last_name === last_name);
  if (city) customers = customers.filter(c => c.city === city);

  // Pagination logic
  const start = (page - 1) * limit;
  const end = page * limit;
  res.json(customers.slice(start, end));
});

// 2. Get single customer by ID
router.get('/:id', (req, res) => {
  const customers = getCustomers();
  const customer = customers.find(c => c.id === parseInt(req.params.id));

  if (!customer) return res.status(404).json({ msg: 'Customer not found' });
  res.json(customer);
});

// 3. List unique cities with number of customers
router.get('/cities/count', (req, res) => {
  const customers = getCustomers();
  const cityCount = customers.reduce((acc, customer) => {
    acc[customer.city] = (acc[customer.city] || 0) + 1;
    return acc;
  }, {});

  res.json(cityCount);
});

// 4. Add a customer with validation
router.post('/', validateCustomer, (req, res) => {
  const customers = getCustomers();
  const newCustomer = {
    id: customers.length + 1,
    ...req.body
  };

  customers.push(newCustomer);
  fs.writeFileSync('./customers.json', JSON.stringify(customers, null, 2));
  res.status(201).json(newCustomer);
});

module.exports = router;
