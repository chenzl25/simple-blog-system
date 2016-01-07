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
						expect(res.error).equal(false);
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
	it('should forbidden the post successfully', function(done) {
	 agentManager.put('/Mapi/post/'+postId)
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.message).equal('禁blog改变成功');
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
	 agentUser.put('/Mapi/post/'+postId+1)
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
	it('should forbidden the post fail for not the manager', function(done) {
	 agentUser.put('/api/post/'+postId)
	 			.send({'content':'adssad', title:'sasddada'})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('该blog已经被禁');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
});

