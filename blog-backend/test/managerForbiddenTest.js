var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');

var User = require('../database/User');
var Post = require(('../database/Post'));
var mongoose = require('mongoose');
chai.use(chaiHttp);
describe('Manager: Register, Login and Post:', function() {
  before(function(done){
    User.collection.drop();
    Post.collection.drop();
    done();
  });
  after(function(done){
    User.collection.drop();
    Post.collection.drop();
    done();
  });
	var agentManager;
  var agentUser;
  var postId;
  var commentId;
	it('should register login successfully', function(done) {
		chai.request(server)
				.post('/Mapi/register')
				.send({account:'111111', password:'111111', name:'haha'})
				.then((res) => {
					expect(res.body.error).equal(false);	
					agentManager = chai.request.agent(server);
					agentManager
						.post('/api/login')
						.send({'account':'111111', 'password':'111111'})
						.then((res) =>{
						// expect(res).to.have.cookie('sessionid');
							expect(res.body.error).equal(false);
							done();
						});
				}).catch(function(err) {
					done(err);
				});
	});
	it('should register login successfully', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({account:'222222', password:'222222', name:'gagaga'})
				.then((res) => {
					expect(res.body.error).equal(false);	
					agentUser = chai.request.agent(server);
					agentUser
						.post('/api/login')
						.send({'account':'222222', 'password':'222222'})
						.then((res) =>{
						// expect(res).to.have.cookie('sessionid');
						expect(res.error).equal(false);
						done();
						});
				}).catch(function(err) {
					done(err);
				});
	});
	it('should add post successfully', function(done) {
	 agentUser.post('/api/post')
				.send({title: 'happy', content: 'hehe'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						postId = res.body.postData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should add post successfully', function(done) {
	 agentUser.post('/api/post')
				.send({title: 'happy222', content: 'hehe222'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						postId = res.body.postData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should add comment successfully', function(done) {
	 agentUser.post('/api/post/'+postId+'/comment')
				.send({content: 'commmmmmmmmmmeeeeennnnttt'})
				.then(
					(res) => {
						// console.log(res.body);
						expect(res.body.error).equal(false);
						expect(res.body.commentData).to.be.a('object');
						expect(res.body.commentData.content).equal('commmmmmmmmmmeeeeennnnttt');
						expect(res.body.commentData.ownerAccount).equal('222222');
						commentId =res.body.commentData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should add comment successfully', function(done) {
	 agentUser.post('/api/post/'+postId+'/comment')
				.send({content: 'commmmmmmeennnnttt'})
				.then(
					(res) => {
						// console.log(res.body);
						expect(res.body.error).equal(false);
						expect(res.body.commentData).to.be.a('object');
						expect(res.body.commentData.content).equal('commmmmmmeennnnttt');
						expect(res.body.commentData.ownerAccount).equal('222222');
						commentId =res.body.commentData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should forbidden the post fail for wrong postId', function(done) {
	 agentManager.put('/Mapi/post/'+postId+1)
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('禁blog改变失败');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should forbidden the post fail for not the manager', function(done) {
	 agentUser.put('/Mapi/post/'+postId)
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('你权限不够');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should forbidden the post successfully', function(done) {
	 agentManager.put('/Mapi/post/'+postId)
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData.title).equal('该blog已经被管理员禁了');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit fail for the forbidden ', function(done) {
	 agentUser.put('/api/post/'+postId)
	 			.send({'content':'adssad', title:'sasddada'})
				.then(
					(res) => {
						// console.log(res.body)
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('该blog已经被禁');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should show the get posts have been forbidden', function(done) {
	 agentUser.get('/api/posts')
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						// console.log(res.body.postsData);
						expect(res.body.postsData).to.be.a('array');
						expect(res.body.postsData).to.has.length(2);
						expect(res.body.postsData[0].isForbidden).equal(true);
						expect(res.body.postsData[0].title).equal('该blog已经被管理员禁了');
						expect(res.body.postsData[0].content).equal('');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should forbidden the comment successfully', function(done) {
	 agentManager.put('/Mapi/post/'+postId+'/comment/'+commentId)
				.then(
					(res) => {
						// console.log(res.body)
						expect(res.body.error).equal(false);
						expect(res.body.commentData.content).equal('该评论已经被管理员禁了');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should show the get posts have been forbidden and the comment has been forbidden', function(done) {
	 agentUser.get('/api/posts')
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						// console.log(res.body.postsData);
						expect(res.body.postsData).to.be.a('array');
						expect(res.body.postsData).to.has.length(2);
						expect(res.body.postsData[0].isForbidden).equal(true);
						expect(res.body.postsData[0].title).equal('该blog已经被管理员禁了');
						expect(res.body.postsData[0].content).equal('');
						// console.log(res.body.postsData[0].comments);
						expect(res.body.postsData[0].comments[1].isForbidden).equal(true);
						expect(res.body.postsData[0].comments[1].content).equal('该评论已经被管理员禁了');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should add comment successfully', function(done) {
	 agentUser.post('/api/post/'+postId+'/comment')
				.send({content: 'hahahah'})
				.then(
					(res) => {
						// console.log(res.body);
						expect(res.body.error).equal(false);
						expect(res.body.commentData).to.be.a('object');
						expect(res.body.commentData.content).equal('hahahah');
						expect(res.body.commentData.ownerAccount).equal('222222');
						res.body.commentData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should show the get posts have been forbidden and the comment has been forbidden', function(done) {
	 agentUser.get('/api/posts')
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						// console.log(res.body.postsData);
						expect(res.body.postsData).to.be.a('array');
						expect(res.body.postsData).to.has.length(2);
						expect(res.body.postsData[0].isForbidden).equal(true);
						expect(res.body.postsData[0].title).equal('该blog已经被管理员禁了');
						expect(res.body.postsData[0].content).equal('');
						// console.log(res.body.postsData[0].comments);
						expect(res.body.postsData[0].comments).to.have.length(3);
						expect(res.body.postsData[0].comments[1].isForbidden).equal(true);
						expect(res.body.postsData[0].comments[1].content).equal('该评论已经被管理员禁了');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('login should find the user posts have been forbidden', function(done) {
		agentUser
			.post('/api/login')
			.send({'account':'222222', 'password':'222222'})
			.then((res) =>{
				expect(res.body.error).equal(false);
				expect(res.body.userData.posts[0].comments[1].isForbidden).equal(true);
				expect(res.body.userData.posts[0].comments[1].content).equal('该评论已经被管理员禁了');
				console.log(res.body.userData.posts[0].comments[1].content);
				done();
			}).catch(err => done(err));
	});
	it('should cancel the forbidden comment successfully', function(done) {
	 agentManager.put('/Mapi/post/'+postId+'/comment/'+commentId)
				.then(
					(res) => {
						console.log(res.body)
						expect(res.body.error).equal(false);
						expect(res.body.commentData.content).not.equal('该评论已经被管理员禁了');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should show the get posts have been forbidden and the comment has been forbidden', function(done) {
	 agentUser.get('/api/posts')
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						// console.log(res.body.postsData);
						expect(res.body.postsData).to.be.a('array');
						expect(res.body.postsData).to.has.length(2);
						expect(res.body.postsData[0].isForbidden).equal(true);
						expect(res.body.postsData[0].title).equal('该blog已经被管理员禁了');
						expect(res.body.postsData[0].content).equal('');
						// console.log(res.body.postsData[0].comments);
						expect(res.body.postsData[0].comments).to.have.length(3);
						expect(res.body.postsData[0].comments[1].isForbidden).equal(false);
						expect(res.body.postsData[0].comments[1].content).equal('commmmmmmeennnnttt');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
});

