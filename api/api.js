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
const ejs = require('ejs');
const partials = require('express-partials');
const sassMiddleware = require('node-sass-middleware')

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
app.use(helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
}));

// app.use('/assets', [
//   express.static(__dirname + '/node_modules/jquery/dist/')
// ]);

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// secure your private routes with jwt authentication middleware
app.all('/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/public', mappedOpenRoutes);
app.use('/private', mappedAuthRoutes);
// app.use('/',express.static('assets'));
app.use('/assets', express.static('assets'));

const { compileSassAndSaveMultiple } = require('compile-sass');
compileSassAndSaveMultiple({
    sassPath: path.join(__dirname, '../assets/scss/'),
    cssPath: path.join(__dirname, '../assets/css/'),
    files: ['layout.scss']
});

server.listen(config.port, () => {
    if (environment !== 'production' &&
        environment !== 'development' &&
        environment !== 'testing'
    ) {
        console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
        process.exit(1);
    }
    return 'Started';
});