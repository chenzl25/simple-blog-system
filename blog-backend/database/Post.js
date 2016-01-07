var mongoose = require('mongoose');
var tools = require('../lib/tools');
var debug = require('debug')('api:Post');
ObjectId = mongoose.Schema.Types.ObjectId;

//sub Schema
var CommentSchema = new mongoose.Schema({
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Number,default: Date.now()},
});

//parent Schema
var PostSchema = new mongoose.Schema({
    title: {type: String, default: null},
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Number,default: Date.now()},
    comments: [CommentSchema]
});
PostSchema.set('autoIndex', true);
CommentSchema.set('autoIndex', false);

//methods
PostSchema.methods.speak = function () {
  console.log(this.name);
};

//static methods 

PostSchema.statics.addPost = function(post) {
  var newPost = Post(post);
  return newPost.save().then(
    postData => Promise.resolve(postData),
    err => Promise.reject(err.message)
  )
};

PostSchema.statics.getPosts = function() {
  var promise
  = this.find()
        .then(
          (postsData) => Promise.resolve(forbiddenFilter(postsData)),
          (err) => Promise.reject(err.message)
        );
  return promise;
};
PostSchema.statics.editPost = function(post) {
  var promise 
  = this.findOne({_id: post._id}).then(
    (postData) => {
      if (!postData) {
        return Promise.reject('该blog不存在');
      } else {
        if (postData.isForbidden) {
          return Promise.reject('该blog已经被禁');
        } else {
          postData.title = post.title;
          postData.content = post.content;
          postData.lastModified = post.lastModified;
          return postData.save().then(
            (postData) => Promise.resolve(postData),
            (err) => Promise.reject(err.message)
          )
        }
      }
    },
    (err) => Promise.reject(err.message)
  );
  return promise;
};
PostSchema.statics.deletePost = function(id) {
  return this.remove({_id: id}).then(
    (removeResult) => Promise.resolve('成功删除blog'),
    (err) => Promise.reject(err.message)
  )
};
PostSchema.statics.addComment = function(postId, commentData) {
  return this.findOne({_id: postId}).then(
            (postData) => {
              postData.comments.push(commentData);
              return postData.save().then((postData) => Promise.resolve(postData.comments[postData.comments.length-1]))
            }
          )
};
PostSchema.statics.editComment = function(postId, comment) {
  return this.findOne({_id: postId}).then(
            (postData) => {
              var commentData =  postData.comments.id(comment._id);
              commentData.content = comment.content;
              commentData.lastModified = comment.lastModified;
              return postData.save().then((postData) => Promise.resolve(commentData))
            }
          )
};
PostSchema.statics.deleteComment = function (postId, commentId) {
  return this.findOne({_id: postId}).then(
    (postData) => {
      if (!postData) {
        return Promise.reject('该blog不存在');
      }
      var commentData = postData.comments.id(commentId);
      if (!commentData) {
        return Promise.reject('该评论不存在');
      }
      return Promise.resolve(commentData.remove())
                    .then(() => postData.save())
                    .then(() => Promise.resolve('成功删除评论'));
    }
  )
};
PostSchema.statics.switchForbiddenPost = function(postId) {
  return this.findOne({_id: postId}).then(
    (postData) => {
      if (!postData) {
        return Promise.reject('该blog不存在');
      }
      postData.isForbidden = !postData.isForbidden;
      return postData.save()
    }
  ).then(
    (postData) => Promise.resolve(postData),
    (err) => {
      debug(err);
      return Promise.reject('禁blog改变失败');
    }
  )
}
function forbiddenFilter(postsDatas) {
  return postsDatas.map((postData) => {
    if (postData.isForbidden) {
      postData.title = '';
      postData.content = '';
    }
    postData.comments = postData.comments.map((commentData) => {
      if (commentData.isForbidden) {
        commentData.content = '';
      }
      return commentData;
    })
    return postData;
  })
}


//Model

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;