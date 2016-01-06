//built-in
var path = require('path');
var crypto = require('crypto');
//middleware
var debug = require('debug')('api:api');
//self
var tools = require('../lib/tools');
var validator = require('../lib/validator');
var User = require('../database/User');
var Post = require('../database/Post');


module.exports.register = function(req, res) {
  debug(req.body);
  res.setHeader('Content-type','application/json');
  var validateResult = validator.validateRegister(req.body);
  if (validateResult) {
    res.json({error: true, message: validateResult});
  } else {
    User.register(req.body.account, req.body.password, req.body.name).then(
      (successMessage) => {
        res.json({error: false, message:successMessage});
      },
      (errorMessage) => {
        res.json({error: true, message: errorMessage});
      }
    );
  }
};

module.exports.login = function(req, res) {
  debug(req.body);
  res.setHeader('Content-type','application/json');
  var validateResult = validator.validateLogin(req.body);
  if (validateResult) {
    res.json({error: true, message: validateResult});
  } else {
    User.login(req.body.account, req.body.password).then(
      (userData) => {
        req.session.userData = userData;
        res.json({error: false, userData: userData});
      },
      (errorMessage) => {
        res.json({error: true, message: errorMessage});
      }
    );
  }
};

module.exports.login = function(req, res) {
  debug(req.body);
  res.setHeader('Content-type','application/json');
  var validateResult = validator.validateLogin(req.body);
  if (validateResult) {
    res.json({error: true, message: validateResult});
  } else {
    User.login(req.body.account, req.body.password).then(
      (userData) => {
        req.session.userData = userData;
        res.json({error: false, userData: userData});
      },
      (errorMessage) => {
        res.json({error: true, message: errorMessage});
      }
    );
  }
};
module.exports.addPost = function(req, res) {
  debug(req.body);
  res.setHeader('Content-type','application/json');
  var validateResult = validator.validatePost(req.body);
  if (validateResult) {
    res.json({error: true, message: validateResult});
  } else {
    User.addPost(req.session.userData.account, req.body.title, req.body.content).then(
      (postData) => {
        debug(postData);
        res.json({error: false, postData: postData});
      },
      (errorMessage) => {
        res.json({error: true, message: errorMessage});
      }
    );
  }
};
module.exports.getPosts = function(req, res) {
  res.setHeader('Content-type','application/json');
  Post.getPosts().then(
    (postsData) => {
      debug(postsData);
      res.json({error: false, postsData: postsData});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  );
};
module.exports.post = function(req, res) {

};
module.exports.editPost = function(req, res) {

};
module.exports.deletePost = function(req, res) {

};
module.exports.addComment = function(req, res) {

};
module.exports.editComment = function(req, res) {

};
module.exports.deleteComment = function(req, res) {

};
module.exports.forbiddenPost = function(req, res) {

};
module.exports.forbiddenComment = function(req, res) {

};


