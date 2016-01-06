var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');
var User = require('../database/User');
var Post = require(('../database/Post'));
var mongoose = require('mongoose');
chai.use(chaiHttp);
describe('Register, Login and Post:', function() {
  after(function(done){
    User.collection.drop();
    Post.collection.drop();
    done();
  });
	it('register only by name', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({'name':'dylan'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('账号为空\n密码为空\n');
					done();
				});
	});
	it('register only by account', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({'account':'14331048'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('密码为空\n名字为空\n');
					done();
				});
	});
	it('register only by password', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({'password':'111111'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('账号为空\n名字为空\n');
					done();
				});
	});
	it('register unformat', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({'account': '11111','password':'11111', 'name':'hahasadasdsasdadsaadsadadsa'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('用户名6~18位英文字母、数字\n密码6~18位英文字母、数字\n名字长度为2-20个字符\n');
					done();
				});
	});
	it('register successfully', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({'account':'111111', 'password':'111111', 'name':'dylan'})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.message).equal('注册成功');
					done();
				});
	});
	it('register already have registerd', function(done) {
		chai.request(server)
				.post('/api/register')
				.send({'account':'111111', 'password':'111111', 'name':'dylan'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('账号已被注册');
					done();
				});
	});
	it('login fail for password wrong', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({'account':'111111', 'password':'11111112'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('账号或密码错误');
					done();
				});
	});
	it('login fail', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({'account':'123456', 'password':'14331048'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					done();
				});
	});
	it('login successfully', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({'account':'111111', 'password':'111111'})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					done();
				});
	});
});

