/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var chalk = require('chalk');
var raven = require('raven');
var dotenv = require('dotenv');
var path = require('path');
var axios = require('axios')

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
require("dotenv").config();
/**
 * Create Express server.
 */
var app = express();

const Sentry = require('@sentry/node');
Sentry.init({
    dsn: process.env.SENTRY_URL,
    sampleRate: 1.0,
    attachStacktrace: true,
    debug: true,
});

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/* routes */
app.get("/fetch-error", GenerateFetchError)
app.get("/syntax-error", GenerateSyntaxError)
app.get("/type-error", GenerateTypeError)

console.log('Setting up Sentry Error reporting');
app.use(raven.errorHandler());
getUnknownFunction()
/**
 * Start Express server.
 */
app.listen(3001, () => {
    console.log('%s App is running at http://localhost:3001', chalk.green('✓'));
    console.log('  Press CTRL-C to stop\n');
  });
  
function GenerateFetchError(req, res) {
    console.log('GenerateFetchError called')
    axios.get("https://spritlesoftware.freshdesk.com/api/v2/tickets").then(result => {
        console.log('result', result)
    }).catch(error => {
        console.log('error', error)
    })
}
function GenerateSyntaxError(req, res) {
    console.log('GenerateSyntaxError called')
    let obj = null
    obj.str = "sample string"
    obj.arr = [1, 2, 3, 4]
}
function GenerateTypeError(req, res) {
    console.log('GenerateTypeError called')
    //let obj = null
    //obj.str = "sample string"
    //obj.arr = [1, 2, 3, 4]
}