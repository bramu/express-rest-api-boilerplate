const publicRoutes = {
  'POST /user': 'users.register',
  'POST /register': 'users.register', // alias for POST /user
  'POST /login': 'users.login',
  'POST /validate': 'users.validate',
  'GET /': 'users.helloWorld',
  'GET /editable/:slug': 'categories.show',
  'GET /editable/:productId/:slug': 'product.show',
  'GET /pro/:productId/:slug': 'product.showpro',
};

module.exports = publicRoutes;
