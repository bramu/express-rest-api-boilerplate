const _ = require('lodash');
const Product = require('../models/Product');
const ProductFileFormatsAndDownloads = require('../models/ProductFileFormatsAndDownloads');
const Category = require('../models/Category');
const ProductCategoryOverView = require('../models/ProductCategoryOverView');
const ProductImages = require('../models/ProductImages');
const ProductPackageSets = require('../models/ProductPackageSets');

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
    let model = {};
    let url = req.path;
    const prodOpts = {
      productId: Number(req.params.productId),
      slug: req.params.slug,
    };

    console.log(await ProductPackageSets.getPackageProducts(15649));

    return Product.getByIdSlug(prodOpts)
      .then((product) => {
        if (!product) {
          return Promise.reject(new Error('Url Not Found'));
        }
        model = _.omit(product, [
          'userId',
          'editingStatus',
          'editingBy',
          'lastEditTime',
          'createdTime',
          'updatedTime',
          'btProductId',
          'defaultFileformat',
        ]);
        return ProductFileFormatsAndDownloads.getFileFormats(model.id);
      })
      .then((fileFormats) => {
        model.fileFormats = fileFormats;
        model.fileFormats.forEach((r) => {
          if (r.fileFormat === 'GDocsLink') {
            r.fileFormat = 'Google Docs';
          }
        });
        return ProductCategoryOverView.getOverView(model.id);
      })
      .then((overview) => {
        model.overview = overview;
        return ProductImages.getByProductId(model.id);
      })
      .then((images) => {
        model.images = images;
        const relatedProductIds = model.relatedProducts.split(',');
        const data = {
          productId: model.id,
          productTitle: model.title,
          siteUrlsId: [], // need to update with inner page sidebar data
          isPro: model.is_pro,
          offSet: 0,
          perPage: 12,
        };
        if (relatedProductIds.length < 1) {
          return Product.getRelatedProducts(data);
        }
        return Product.getRelatedProductsNew(relatedProductIds);
      })
      .then((relatedProducts) => {
        model.relatedProducts = [];
        if (relatedProducts && relatedProducts.length) {
          model.relatedProducts = relatedProducts;
        }
        model.firstfold = 'product';
        model.layout = 'layouts/new-layout.ejs';
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
