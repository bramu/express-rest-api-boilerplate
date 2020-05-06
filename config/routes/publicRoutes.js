const publicRoutes = {
  'POST /user': 'users.register',
  'POST /register': 'users.register', // alias for POST /user
  'POST /login': 'users.login',
  'POST /validate': 'users.validate',
  'GET /': 'users.helloWorld',
  'GET /editable/:slug': 'categories.show',
  'GET /editable/:productId/:slug': 'product.show',
  'GET /pro/:productId/:slug': 'product.showpro',
  'POST /user/register': 'users.register',
  'POST /user/login': 'users.login',
};

module.exports = publicRoutes;
