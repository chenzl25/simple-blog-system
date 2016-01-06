var mongoose = require('mongoose');
var crypto = require('crypto');
var Post = require('./Post');
var debug = require('debug')('api:User');
ObjectId = mongoose.Schema.Types.ObjectId;

//sub Schema
var CommentSchema = new mongoose.Schema({
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Date,default: Date.now},
});
var PostSchema = new mongoose.Schema({
    title: {type: String, default: null},
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Date,default: Date.now},
    comment: [CommentSchema]
});

//parent Schema
var UserSchema = new mongoose.Schema({
    account: {type:String,default: null,index:true},
    password: {type:String,default: null},
    name: {type: String, default: null},
    isManager: {type: Boolean, default: false},
    posts: [PostSchema]
});

UserSchema.set('autoIndex', false);
PostSchema.set('autoIndex', false);
CommentSchema.set('autoIndex', false);

//methods
UserSchema.methods.speak = function () {
  console.log(this.name);
};

//static methods 
UserSchema.statics.register = function (account, password, name) {
    var promise
    = this.find({account:account})
          .count()
          .exec().then(
            (number) => {
              if (number === 0) {
                var hashedPassword = crypto.createHash('sha1')
                                          .update(password)
                                          .digest('base64');
                var user = User({account: account, password: hashedPassword, name: name});
                user.save(this.invalidDataHandler);
                return Promise.resolve('注册成功');
              } else {
                return Promise.reject('账号已被注册');
              }
            },
            (err) => {
              return Promise.reject(err);
            }
          );
    return promise;
};
UserSchema.statics.login = function (account, password) {
    var hashedPassword = crypto.createHash('sha1')
                                 .update(password)
                                 .digest('base64');
    var promise
    = this.findOne({account:account, password: hashedPassword}, {password:0})
          .exec().then(
            (userData) => {
              if (!userData) {
                return Promise.reject('账号或密码错误');
              }
              return Promise.resolve(userData);
            },
            (err) => {
              return Promise.reject(err);
            }
          );
    return promise;
};
UserSchema.statics.addPost = function (account, title, content) {
  var that = this;
  var promise
    = this.findOne({account:account})
          .exec().then(
            (userData) => {
              if (!userData) {
                return Promise.reject('没有该账号');
              }
              var newPost = {};
              newPost.ownerAccount = account;
              newPost.title = title;
              newPost.content = content;
              userData.posts.unshift(newPost);
              return userData.save().then(
                (userData) => {
                  return Post.addPost(userData.posts[0]);
                },
                (err) => {
                  that.invalidDataHandler(err);
                }
              );
            },
            (err) => {
              return Promise.reject(err);
            }
          );
    return promise;
};
UserSchema.statics.getPosts = function(account) {
  var promise
    = this.findOne({account:account}, {posts:1})
          .exec().then(
            (postsData) => {
              return Promise.resolve(postsData);
            },
            (err) => {
              return Promise.reject(err);
            }
          );
    return promise;
};

function invalidDataHandler (err) {
    // err is our ValidationError object
    // err.errors.password is a ValidatorError object
    if (err) {
        console.log(err);
        console.log('Attention!');
        console.log('--------------the save() failed----------------------');
        for (var i in err.errors) {
            console.log(err.errors[i].message); // prints 'Validator "Invalid password" failed for path password with value `grease`'
            console.log(err.errors[i].kind);  // prints "Invalid password"
            console.log(err.errors[i].path);  // prints "password"
            console.log(err.errors[i].value); // prints "vlue of password"
        }
        console.log('-----------------------------------------------------');
    } else {
        console.log('save successfully');
    }
}


//Model
var User = mongoose.model('User', UserSchema);

module.exports = User;