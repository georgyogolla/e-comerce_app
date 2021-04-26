const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../Repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

//router for listing products
router.get('/admin/products', (req, res) => {});

//router to display a form for creating a new product
router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

//creating a new product
router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
  const errors = validationResult(req);
  console.log(errors)
  res.send('submitted');
});
module.exports = router;