'use strict';

let express = require('express');

require('dotenv').config();
let app = express();
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let mongoose = require('mongoose');
let Promise = require('bluebird');
let compression = require('compression');
mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASE_URI);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(compression());
app.use(expressValidator());

var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./routes.js')(app);
app.listen(process.env.SERVER_PORT);
console.log(`${process.env.PROJECT_NAME} START ON:>> ${process.env.SERVER_PORT}`);