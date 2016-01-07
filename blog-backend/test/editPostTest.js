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
	}) 
	it('should edit post successfully', function(done) {
	 agent.put('/api/post/'+id)
				.send({title: '123' , content: '456'})
				.then(
					(res) => {
						expect(res.body.error).equal(false);
						expect(res.body.postData.title).equal('123');
						expect(res.body.postData.content).equal('456');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should edit post fail for the id do not exists', function(done) {
	 agent.put('/api/post/'+123)
				.send({title: '123' , content: '456'})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						console.log(res.body.message);
						expect(res.body.message).equal('没有该blog');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit post fail for blog标题为空', function(done) {
	 agent.put('/api/post/'+id)
				.send({title: '' , content: '456'})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						console.log(res.body.message);
						expect(res.body.message).equal('blog标题为空\n');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit post fail for blog内容为空', function(done) {
	 agent.put('/api/post/'+id)
				.send({title: '213' , content: ''})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						console.log(res.body.message);
						expect(res.body.message).equal('blog内容为空\n');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
	it('should edit post fail for blog标题为空 and blog内容为空', function(done) {
	 agent.put('/api/post/'+id)
				.send({title: '' , content: ''})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						console.log(res.body.message);
						expect(res.body.message).equal('blog标题为空\nblog内容为空\n');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	});
});