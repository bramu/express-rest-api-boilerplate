const _ = require('lodash');

const CategoryPageController = () => {

    const show = async(req, res) => {

        try {
            let model = {};
            model.layout = 'layouts/category.ejs';
            model.firstfold = 'category';
            return res.render('pages/category-page.ejs', model);
        } catch (err) {
            // console.log(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    };


    return {
        show
    };
};

module.exports = CategoryPageController;