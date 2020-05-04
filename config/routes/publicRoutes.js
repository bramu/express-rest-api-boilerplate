const publicRoutes = {
  'POST /user': 'users.register',
  'POST /register': 'users.register', // alias for POST /user
  'POST /login': 'users.login',
  'POST /validate': 'users.validate',
  'GET /': 'users.helloWorld',
  'GET /editable/:slug': 'categories.show',
};

module.exports = publicRoutes;
