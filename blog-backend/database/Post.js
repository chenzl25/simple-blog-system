var mongoose = require('mongoose');
ObjectId = mongoose.Schema.Types.ObjectId;

//sub Schema
var CommentSchema = new mongoose.Schema({
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Date,default: Date.now},
});

//parent Schema
var PostSchema = new mongoose.Schema({
    title: {type: String, default: null},
    content: {type: String, default: null},
    ownerAccount: {type: String, default: null},
    isForbidden: {type: Boolean, default: false},
    lastModified: {type:Date,default: Date.now},
    comment: [CommentSchema]
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
  return newPost.save();
};

PostSchema.statics.getPosts = function() {
  var promise
  = this.find()
        .exec().then(
          (postsData) => {
            return Promise.resolve(forbiddenFilter(postsData));
          },
          (err) => {
            return Promise.reject(err);
          }
        );
  return promise;
};

function forbiddenFilter(postsDatas) {

}

function invalidDataHandler(err) {
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

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;