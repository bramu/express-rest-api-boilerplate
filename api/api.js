/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { compileSassAndSaveMultiple } = require('compile-sass');
const fs = require('fs');
const Assets = require('./helpers/assets').getJavascriptFile();

require('dotenv').config();

/**
 * server configuration
 */
const config = require('../config/');
// const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
// const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

// app.use('/assets', [
//   express.static(__dirname + '/node_modules/jquery/dist/')
// ]);

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.set('layout extractScripts', true);

// secure your private routes with jwt authentication middleware
app.all('/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/public', mappedOpenRoutes);
app.use('/private', mappedAuthRoutes);

app.use('/assets', [
  express.static(path.join(__dirname, '../node_modules/jquery/dist/')),
  express.static(path.join(__dirname, '../node_modules/materialize-css/dist/')),
  express.static('assets'),
]);

const testFolder = path.join(__dirname, '../assets/styles/firstfold/');
const scssfiles = fs.readdirSync(testFolder);

compileSassAndSaveMultiple({
  sassPath: path.join(__dirname, '../assets/styles/firstfold/'),
  cssPath: path.join(__dirname, '../assets/css/firstfold/'),
  files: scssfiles,
});

compileSassAndSaveMultiple({
  sassPath: path.join(__dirname, '../assets/styles/'),
  cssPath: path.join(__dirname, '../assets/css/'),
  files: ['layout.scss'],
});

app.locals.renderScripts = Assets;

server.listen(config.port, () => {
  if (
    environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
  return 'Started';
});
