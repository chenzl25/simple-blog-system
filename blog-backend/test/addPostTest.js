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
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should add post fail for empty blog content ', function(done) {
	 agent.post('/api/post')
				.send({title: 'happy'})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('blog内容为空\n');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should add post fail for too long blog title ', function(done) {
	 agent.post('/api/post')
				.send({title: 'happyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappy'+
											'happyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappy'+
											'happyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappy'+
											'happyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappyhappy'
												, content: 'sadad'})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('blog标题长度为2-50个字符\n');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
	it('should add post fail for too short blog title ', function(done) {
	 agent.post('/api/post')
				.send({title: '1' , content: 'sadad'})
				.then(
					(res) => {
						expect(res.body.error).equal(true);
						expect(res.body.message).equal('blog标题长度为2-50个字符\n');
						done();
					}
				).catch(function(err) {
					done(err);
				});
	}) 
});