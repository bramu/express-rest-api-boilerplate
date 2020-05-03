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

  return {
    show,
  };
};

module.exports = CategoryPageController;
