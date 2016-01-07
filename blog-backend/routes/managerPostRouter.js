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

var express = require('express');
var router = express.Router();

router.post('/register', tools.validateMiddleware(validator.validateRegister.bind(validator)), function(req, res) {
	debug(req.body);
  User.register(req.body.account, req.body.password, req.body.name, true).then(
    (successMessage) => {
      res.json({error: false, message:successMessage});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  );	
})

router.use(tools.checkLoginMiddleware);
router.use(tools.checkManagerMiddleware);

router.put('/post/:postId', function switchForbiddenPost(req, res) {
	Post.switchForbiddenPost(req.params.postId)
	 		.then((postData) => User.switchForbiddenPost(postData.ownerAccount, postData._id))
	 		.then(
	 			() => res.json({error: false, message: '禁blog改变成功'}),
	 			(errorMessage) => res.json({error: true, message: errorMessage})
	 		);
		
});
router.put('/post/:postId/comment/:commentId', function switchForbiddenComment(req, res) {

})

module.exports = router;