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
	it('add post successfully', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({account:'111111', password:'111111', name:'haha'})
				.then((res) => {
					expect(res.body.error).equal(false);	
					var agent = chai.request.agent(server);
					agent
						.post('/api/login')
						.send({'account':'111111', 'password':'111111'})
						.then((res) =>{
					    // expect(res).to.have.cookie('sessionid');
					    return agent
									    .post('/api/post')
											.send({title: 'happy', content: 'hehe'})
											.then(
												(res) => {
													expect(res.body.error).equal(false);
													expect(res.body.postData).to.be.a('object');
													done();
												}
											);
						});
				}).catch(function(err) {
					done(err);
				});
	});
});