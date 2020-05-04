const _ = require('lodash');

const Product = require('../models/Product');

const ProductPageController = () => {
  const show = async (req, res) => {
    const model = {};
    let productId = Number(req.params.productId);
    let slug = req.params.slug;
    model.firstfold = 'product';
    model.url = req.path;
    model.layout = 'layouts/new-layout.ejs';

    res.render('pages/product.ejs', model);
  };

  const showpro = async (req, res) => {
    const model = {};
    let productId = Number(req.params.productId);
    let slug = req.params.slug;
    model.firstfold = 'product';
    model.url = req.path;
    model.layout = 'layouts/new-layout.ejs';

    res.render('pages/pro-product.ejs', model);
  };

  return {
    show,
    showpro,
  };
};

module.exports = ProductPageController;
