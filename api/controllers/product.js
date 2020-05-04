const _ = require('lodash');
const Product = require('../models/Product');
const ProductFileFormatsAndDownloads = require('../models/ProductFileFormatsAndDownloads');
const Category = require('../models/Category');
const ProductCategoryOverView = require('../models/ProductCategoryOverView');
const ProductImages = require('../models/ProductImages');

const formatArray = [
  'GDocsLink',
  'Google Sheets',
  'Illustrator',
  'InDesign',
  'MS Excel',
  'MS Word',
  'Numbers',
  'Pages',
  'Photoshop',
  'Portable Documents',
  'Publisher',
  'Google Docs',
  'HTML5',
  'PDF',
  'Wordpress',
  'Outlook',
];

const ProductPageController = () => {
  const show = async (req, res) => {
    const model = {};
    let productId = Number(req.params.productId);
    let slug = req.params.slug;
    let url = req.path;
    model.productId = productId;
    model.slug = slug;
    model.firstfold = 'product';
    model.layout = 'layouts/new-layout.ejs';

    return Product.getByIdSlug(model)
      .then((product) => {
        if (!product) {
          return Promise.reject(new Error('Url Not Found'));
        }
        model.product = product;
        return ProductFileFormatsAndDownloads.getFileFormats(model.product.id);
      })
      .then((fileFormats) => {
        model.fileFormats = fileFormats;
        model.fileFormats.forEach((r) => {
          if (r.fileFormat === 'GDocsLink') {
            r.fileFormat = 'Google Docs';
          }
        });
        return ProductCategoryOverView.getOverView(model.product.id);
      })
      .then((overview) => {
        model.overview = overview;
        return ProductImages.getByProductId(model.product.id);
      })
      .then((images) => {
        model.images = images;
        return ProductFileFormatsAndDownloads.getFileFormatDimes(
          model.product.id
        );
      })
      .then((fileDemensions) => {
        model.fileDimensions = fileDemensions;
        let dimensions = [];
        model.fileDimensions.forEach((r) => {
          if (r.fileDimension.indexOf(',') < 0 && r.fileDimension !== '') {
            dimensions.push(r.fileDimension);
          } else if (r.fileDimension !== '') {
            let dime = r.fileDimension;
            let dimeArray = dime.split(',');
            dimensions = [...dimeArray];
          }
        });
        model.dimensions = _.uniq(dimensions);
        for (let i = 0; i < model.dimensions.length; i++) {
          if (model.dimensions[i] === '') {
            model.dimensions.splice(i, 1);
          }
        }

        console.log(model);

        res.render('pages/product.ejs', model);
      });
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
