var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');
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
  var agent;
  var id;
	it('should register login successfully', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({account:'111111', password:'111111', name:'haha'})
				.then((res) => {
					expect(res.body.error).equal(false);	
					agent = chai.request.agent(server);
					agent
						.post('/api/login')
						.send({'account':'111111', 'password':'111111'})
						.then((res) => {
					    // expect(res).to.have.cookie('sessionid');
					    console.log(res.body);
					    expect(res.body.error).equal(false);
					    expect(res.body.userData.posts).to.be.a('array');
					    expect(res.body.userData.posts).to.has.length(0);
					    done();
						});
				}).catch(function(err) {
					done(err);
				});
	});
	it('should add post successfully', function(done) {
	 agent.post('/api/post')
				.send({title: 'happy', content: 'hehe'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						id = res.body.postData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should add post successfully', function(done) {
	 agent.post('/api/post')
				.send({title: 'happy', content: 'hehe'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						id = res.body.postData._id;
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should get posts of length 2', function(done) {
	 agent.get('/api/posts')
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postsData).to.be.a('array');
						expect(res.body.postsData).to.have.length(2);
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should delete post successfully', function(done) {
	 agent.delete('/api/post/'+id)
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.message).equal('成功删除blog');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should get posts of length 0', function(done) {
	 agent.get('/api/posts')
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postsData).to.be.a('array');
						expect(res.body.postsData).to.have.length(1);
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should delete post fail', function(done) {
	 agent.delete('/api/post/'+id+1)
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('该blog不存在');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
});