const _ = require('lodash');

const SiteUrls = require('../models/SiteUrls');

const CategoryPageController = () => {
    const show = async (req, res) => {

        let model = {};
        model.layout = 'layouts/category.ejs';
        model.firstfold = 'category';
        model.url = req.url;
        
        return SiteUrls.getByUrl(model)
            .then((result) => {
                console.log(result);
                if(!result){
                    return Promise.reject(new Error('Url Not Found'));
                }
                model.siteUrlId = result.id;
                model.freeProductsCount = result.freeProductsCount;
                model.title = result.title;
                model.headerBannerSection = result.headerBannerSection;
                model.metaTitle = result.metaTitle;
                model.stickyBanner = result.stickyBanner;
                return SiteUrls.getProductsByUrl(model)
            })
            .then((products)=>{
                if(!products){
                    return Promise.reject(new Error('No Products Found'));
                }
                model.products = products;
                return res.status(200).json({
                    'msg':'Page Found'
                });
            })
            .catch((err)=>{
                console.log(err);
                return res.status(404).json({
                'msg':'Page Not Found'
                });
            });
            // return res.render('pages/category-page.ejs', model);
        }


  return {
    show
  };
};

module.exports = CategoryPageController;
