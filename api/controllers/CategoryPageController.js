<<<<<<< HEAD
const _ = require('lodash');

const SiteUrls = require('../models/SiteUrls');

=======
>>>>>>> 8d376ff440a931b741ca275932065e8edefb02bf
const CategoryPageController = () => {
  const show = async (req, res) => {
    try {
      const model = {};
      model.layout = 'layouts/category.ejs';
      return res.render('pages/category-page.ejs', model);
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

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
        return SiteUrls.getProductsByUrl(model)
        })
        .then((products)=>{
            if(!products){
                return Promise.reject(new Error('No Products Found'));
            }
            return res.status(200).json({
                'msg':'Page Found'
            });
        })
        .catch((err)=>{
            console.log(err);
            return res.status(404).json({
                'msg':'Page Not Found'
            });
        })
            // return res.render('pages/category-page.ejs', model);
        
    };


  return {
    show
  };
};

module.exports = CategoryPageController;
