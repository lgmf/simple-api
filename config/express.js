var express = require('express')
    ,app = express()
    ,cors = require('cors')
    ,bodyParser = require('body-parser')
    ,routes = require('../app/routes')
    ,path =  require('path');
    
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


routes(app);

module.exports = app;