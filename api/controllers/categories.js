const _ = require('lodash');

const SiteUrls = require('../models/SiteUrls');
const SiteUrlsFaq = require('../models/SiteUrlsFaq');

const CategoryPageController = () => {
  const show = async (req, res) => {
    const model = {};
    const productOpts = {};
    let perPage;
    let currentpage;
    model.layout = 'layouts/category.ejs';
    model.firstfold = 'category';
    model.url = req.path;
    perPage = 30;
    currentpage = Number((req.query && req.query.page) || 1);
    currentpage = currentpage < 0 ? 1 : currentpage;
    productOpts.offset = currentpage ? (currentpage - 1) * perPage : 0;
    productOpts.limit = perPage;
    productOpts.url = model.url;
    productOpts.sortBy = req.query.sortby || 'popular';

    return SiteUrls.getByUrl(model)
      .then((result) => {
        console.log(result);
        if (!result) {
          return Promise.reject(new Error('Url Not Found'));
        }
        productOpts.siteUrlId = result.id;
        model.siteUrlId = result.id;
        model.freeProductsCount = result.freeProductsCount;
        model.title = result.title;
        model.headerBannerSection = result.headerBannerSection;
        model.metaTitle = result.metaTitle;
        model.stickyBanner = result.stickyBanner;
        return SiteUrls.getProductsByUrl(productOpts);
      })
      .then((products) => {
        if (!products) {
          return Promise.reject(new Error('No Products Found'));
        }
        model.products = products;
        return SiteUrlsFaq.getFaqsById(model.siteUrlId);
      })
      .then((faqs) => {
        model.faqs = faqs;
        return res.render('pages/category-page.ejs', model);
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({
          msg: 'Page Not Found',
        });
      });
  };

  return {
    show,
  };
};

module.exports = CategoryPageController;
