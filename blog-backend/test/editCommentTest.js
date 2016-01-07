var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');
console.log(server);
var User = require('../database/User');
var Post = require(('../database/Post'));
var mongoose = require('mongoose');
chai.use(chaiHttp);
describe('add post', function() {
	before(function(done) {
		User.collection.drop();
		Post.collection.drop();
		done();
	})
	after(function(done){
		User.collection.drop();
		Post.collection.drop();
		done();
  });
  var agent1;
  var agent2;
  var postId;
  var commentId;
	it('should register login successfully', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({account:'111111', password:'111111', name:'haha'})
				.then((res) => {
					expect(res.body.error).equal(false);	
					agent1 = chai.request.agent(server);
					agent1
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
					agent2 = chai.request.agent(server);
					agent2
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
	 agent1.post('/api/post')
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
	})
	it('should add comment successfully', function(done) {
	 agent2.post('/api/post/'+postId+'/comment')
				.send({content: 'commmmmmmmmmmeeeeennnnttt'})
				.then(
					(res) => {
						console.log(res.body);
						expect(res.body.error).equal(false);
						expect(res.body.commentData).to.be.a('object');
						expect(res.body.commentData.content).equal('commmmmmmmmmmeeeeennnnttt');
						expect(res.body.commentData.ownerAccount).equal('222222');
						expect(res.body.commentData._id).to.be.a('string');
						commentId = res.body.commentData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit comment successfully', function(done) {
	 agent2.put('/api/post/'+postId+'/comment/'+commentId)
				.send({content: 'waawaa'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.commentData).to.be.a('object');
						expect(res.body.commentData.content).equal('waawaa');
						expect(res.body.commentData.ownerAccount).equal('222222');
						expect(res.body.commentData._id).to.be.a('string');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit comment faid for wrong commentId', function(done) {
	 agent2.put('/api/post/'+postId+'/comment/'+commentId+1)
				.send({content: 'waawaa'})
				.then(
					(res) => {
						console.log(res.body);
						expect(res.body.error).equal(true);
						console.log(res.body.message.message);
						expect(res.body.message).equal('该评论不存在');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit comment faid for not the commentOwner', function(done) {
	 agent1.put('/api/post/'+postId+'/comment/'+commentId)
				.send({content: 'waawaa'})
				.then(
					(res) => {
						console.log(res.body);
						expect(res.body.error).equal(true);
						console.log(res.body.message.message);
						expect(res.body.message).equal('该评论不属于你');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
});