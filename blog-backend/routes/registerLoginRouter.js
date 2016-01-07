//built-in
var path = require('path');
var crypto = require('crypto');
//middleware
var debug = require('debug')('api:manager');
//self
var tools = require('../lib/tools');
var validator = require('../lib/validator');
var User = require('../database/User');
var Post = require('../database/Post');

var express = require('express');
var router = express.Router();


/* GET home page. */
router.post('/register', tools.validateMiddleware(validator.validateRegister.bind(validator)), function register(req, res) {
  // res.setHeader('Content-type','application/json');
  	debug(req.body);
    User.register(req.body.account, req.body.password, req.body.name).then(
      (successMessage) => {
        res.json({error: false, message:successMessage});
      },
      (errorMessage) => {
        res.json({error: true, message: errorMessage});
      }
    );
  
});

router.post('/login', tools.validateMiddleware(validator.validateLogin.bind(validator)), function login(req, res) {
  // res.setHeader('Content-type','application/json');
  User.login(req.body.account, req.body.password).then(
    (userData) => {
  		debug(userData);
      req.session.userData = userData;
      res.json({error: false, userData: userData});
    },
    (errorMessage) => {
    	debug(errorMessage);
      res.json({error: true, message: errorMessage});
    }
  );
});


module.exports = router;