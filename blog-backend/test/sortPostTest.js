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
						.then((res) =>{
					    // expect(res).to.have.cookie('sessionid');
					    expect(res.body.error).equal(false);
					    done();
						});
				}).catch(function(err) {
					done(err);
				});
	});
	it('should add post successfully', function(done) {
	 agent.post('/api/post')
				.send({title: 'eeeee', content: 'eeeee'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should add post successfully', function(done) {
	 agent.post('/api/post')
				.send({title: 'aaaaa', content: 'aaaaa'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should add post successfully', function(done) {
 		agent.post('/api/post')
			.send({title: 'bbbbb', content: 'bbbbb'})
			.then(
				(res) => {
					expect(res.body.error).equal(false);
					expect(res.body.postData).to.be.a('object');
					done();
				}
			).catch(function(err) {
				done(err);
			});
	}) 
	it('should add post successfully', function(done) {
	 agent.post('/api/post')
				.send({title: 'ccccc', content: 'ccccc'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should add post successfully', function(done) {
	 agent.post('/api/post')
				.send({title: 'ddddd', content: 'ddddd'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData).to.be.a('object');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	
	it('should register login successfully', function(done) {
			agent
				.get('/api/posts')
				.send({'account':'111111', 'password':'111111'})
				.then((res) =>{
			    // expect(res).to.have.cookie('sessionid');
			    expect(res.body.error).equal(false);
			    console.log(res.body.postsData);
			    done();
				}).catch(function(err) {
					done(err);
				});
	});
});