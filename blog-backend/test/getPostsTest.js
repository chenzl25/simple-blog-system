var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');
var User = require('../database/User');
var Post = require(('../database/Post'));
var mongoose = require('mongoose');
chai.use(chaiHttp);
describe('get posts', function() {
	before((done) => {
		User.collection.drop();
    Post.collection.drop();
    done();
	});
	after((done) => {
    User.collection.drop();
    Post.collection.drop();
    done();
  });
  var agent; // global variable
	it('register and login', function(done) {
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
					    expect(res.body.error).equal(false);
					    done();
						});
					// done();
				}).catch(function(err) {
					done(err);
				});
	});
	it('add post', function(done) {
		 agent.post('/api/post')
					.send({title: 'happy', content: 'hehe'})
					.then(
						(res) => {
							expect(res.body.error).equal(false);
							expect(res.body.postData).to.be.a('object');
							done();
						}
					);
	});
	it('add post', function(done) {
		 agent.post('/api/post')
					.send({title: 'happy', content: 'hehe'})
					.then(
						(res) => {
							expect(res.body.error).equal(false);
							expect(res.body.postData).to.be.a('object');
							done();
						}
					);
	});	
	it('get posts', function(done) {
		agent.get('/api/posts')
					.then(
						(res) => {
							expect(res.body.error).equal(false);
							console.log(res.body);
							expect(res.body.postsData).to.be.a('array');
							expect(res.body.postsData).to.have.length(2);
							done();
						}
					).catch(function(err) {
						done(err);
					});
	});
});