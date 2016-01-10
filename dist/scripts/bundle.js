
var phonecatAnimations = angular.module('phonecatAnimations', ['ngAnimate']);

phonecatAnimations.animation('.phone', function() {

  var animateUp = function(element, className, done) {
    if(className != 'active') {
      return;
    }
    element.css({
      position: 'absolute',
      top: 500,
      left: 0,
      display: 'block'
    });

    jQuery(element).animate({
      top: 0
    }, done);

    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
  }

  var animateDown = function(element, className, done) {
    if(className != 'active') {
      return;
    }
    element.css({
      position: 'absolute',
      left: 0,
      top: 0
    });

    jQuery(element).animate({
      top: -500
    }, done);

    return function(cancel) {
      if(cancel) {
        element.stop();
      }
    };
  }

  return {
    addClass: animateUp,
    removeClass: animateDown
  };
});

/* App Module */

var blogApp = angular.module('blogApp', [
  'ngRoute',
  'blogControllers'
]);

blogApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: './partials/login.html',
        controller: 'loginCtrl'
      }).
      when('/register', {
        templateUrl: './partials/register.html',
        controller: 'registerCtrl'
      }).
      when('/user', {
        templateUrl: './partials/user.html',
        controller: 'userCtrl'
      }).
      when('/home', {
        templateUrl: './partials/home.html',
        controller: 'homeCtrl'
      }).
      when('/user/:postId', {
        templateUrl: './partials/user-post-detail.html',
        controller: 'userPostDetailCtrl'
      }).
      when('/home/:postId', {
        templateUrl: './partials/home-post-detail.html',
        controller: 'homePostDetailCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

var blogControllers = angular.module('blogControllers', ['blogServices']);

blogControllers.controller('loginCtrl', ['$scope', '$rootScope','$http','validator','$location',
  function($scope, $rootScope, $http, validator, $location ) {
    $scope.message = '';
    $scope.messageClass = '';
    $scope.account = '';
    $scope.password = '';
    $scope.login = function() {
      var validateResult = validator.validateLogin({account: $scope.account, password: $scope.password});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/login', {account:$scope.account,password:$scope.password}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.userData = data.userData;
            $location.url('/user');
          }
        });
      }
    }
  }]);
blogControllers.controller('registerCtrl', ['$scope','$http','validator',
  function($scope, $http, validator ) {
    $scope.message = '';
    $scope.messageClass = '';
    $scope.account = '';
    $scope.password = '';
    $scope.again = '';
    $scope.name = '';
    $scope.register = function() {
      var validateResult = validator.validateRegister({account: $scope.account, password: $scope.password, name: $scope.name});
      if ($scope.password !== $scope.again) {
        validateResult += '两次输入密码不相同\n';
      }
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/register', {account:$scope.account,password:$scope.password,name:$scope.name}).success(function(data) {
          alert(data.message, data.error)
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = data.message;
          }
        });
      }
    }
  }]);

blogControllers.controller('userCtrl', ['$scope','$http','validator','$rootScope','$location',
  function($scope, $http, validator, $rootScope, $location) {
    // $scope.userData = $rootScope.userData;  
    $http.post('/proxy/api/login', {account:'14331048',password:'14331048'}).success(function(data) {
      $rootScope.userData = data.userData;
    });
    $scope.enterPostDetail = function(postData) {
      $rootScope.postData = postData;
      $location.url('/user/'+postData._id);
    }
    $scope.title = '';
    $scope.content = '';
    $scope.message = '';
    $scope.messageClass = '';
    $scope.createPost = function() {
      console.log($scope.message.length);
      var validateResult = validator.validatePost({title: $scope.title, content: $scope.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/post', {title: $scope.title, content: $scope.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.userData.posts.unshift(data.postData);
          }
        });
      }
    }
  }]);


blogControllers.controller('userPostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location,$routeParams) {
    $http.get('/proxy/api/posts').success(function(data) {
      $rootScope.postsData = data.postsData;
      $rootScope.postData = data.postsData[2];
    });
    $scope.content = '';
    $scope.createComment = function () {
      var validateResult = validator.validateComment({content: $scope.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/post/'+$routeParams.postId+'/comment', {title: $scope.title, content: $scope.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.postData.comments.push(data.commentData);
          }
        });
      }
    }
    $scope.editState = false;
    $scope.messageClass = '';
    $scope.message = '';
    $scope.editStateHandler = function() {
      $scope.editState = !$scope.editState;
    }
    $scope.editPost = function() {
      var validateResult = validator.validatePost({title: $rootScope.postData.title,content: $rootScope.postData.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.put('/proxy/api/post/'+$routeParams.postId, {title: $scope.postData.title, content: $scope.postData.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $scope.editState = false;
            $rootScope.postData = data.postData;
          }
        });
      }
    }
  }]);

blogControllers.controller('homeCtrl', ['$scope','$http','validator','$rootScope','$location',
  function($scope, $http, validator, $rootScope, $location) {
    $http.get('/proxy/api/posts').success(function(data) {
      $rootScope.postsData = data.postsData;
    });
    $scope.enterPostDetail = function(postData) {
      $rootScope.postData = postData;
      $location.url('/home/'+postData._id);
    }
  }]);

blogControllers.controller('homePostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location, $routeParams) {
    $http.get('/proxy/api/posts').success(function(data) {
      $rootScope.postsData = data.postsData;
      $rootScope.postData = data.postsData[2];
    });
    $scope.content = '';
    $scope.createComment = function () {
      var validateResult = validator.validateComment({content: $scope.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/post/'+$routeParams.postId+'/comment', {title: $scope.title, content: $scope.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.postData.comments.push(data.commentData);
          }
        });
      }
    }
  }]);

/* Directives */

/* Filters */

angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});


/* Services */

var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('Blog', ['$resource',
  function($resource){
    return $resource('api/post/:postId', {}, {
      query: {method:'GET', params:{phoneId:'posts'}, isArray:true},

    });
  }]);
blogServices.factory('validator',
  function(){
	  var validator = {
			beChecked: {
				userAccount: {
					errorMessage: '用户名6~18位英文字母、数字',
					emptyMessage: '账号为空',
					pattern: /^[a-zA-Z0-9]{6,18}$/
				},
				userPassword: {
					errorMessage: '密码6~18位英文字母、数字',
					emptyMessage: '密码为空',
					pattern: /^[a-zA-Z0-9]{6,18}$/
				},
				userName: {
					errorMessage: '名字长度为2-20个字符',
					emptyMessage: '名字为空',
					pattern: /^.{2,20}$/
				},
				postTitle: {
					errorMessage: 'blog标题长度为2-50个字符',
					emptyMessage: 'blog标题为空',
					pattern: /^.{2,50}$/
				},
				postContent: {
					errorMessage: 'blog内容长度为2-10000个字符',
					emptyMessage: 'blog内容为空',
					pattern: /.{2,10000}/
				},
				commentContent: {
					errorMessage: '评论长度为2-2000个字符',
					emptyMessage: '评论内容为空',
					pattern: /.{2,2000}/
				},
			},
			_validate: function(mapper) {
				var result = "";
				for (var key in mapper) {
					if (mapper[key]) {
						if(!this.beChecked[key].pattern.test(mapper[key]))
							result += this.beChecked[key].errorMessage + '\n';
					} else {
						result += this.beChecked[key].emptyMessage + '\n';
					}
				}
				return result;
			},
			validateRegister: function(input) {
				return this._validate({userAccount:input.account, userPassword: input.password, userName:input.name});
			},
			validateLogin: function(input) {
				return this._validate({userAccount:input.account, userPassword: input.password});
			},
			validatePost: function(input) {
				return this._validate({postTitle: input.title, postContent: input.content});
			},
			validateComment: function(input) {
				return this._validate({commentContent: input.content});
			}
		};
		return validator;
  });

var validator = {
	beChecked: {
		userAccount: {
			errorMessage: '用户名6~18位英文字母、数字',
			emptyMessage: '账号为空',
			pattern: /^[a-zA-Z0-9]{6,18}$/
		},
		userPassword: {
			errorMessage: '密码6~18位英文字母、数字',
			emptyMessage: '密码为空',
			pattern: /^[a-zA-Z0-9]{6,18}$/
		},
		userName: {
			errorMessage: '名字长度为2-20个字符',
			emptyMessage: '名字为空',
			pattern: /^.{2,20}$/
		},
		postTitle: {
			errorMessage: 'blog标题长度为2-50个字符',
			emptyMessage: 'blog标题为空',
			pattern: /^.{2,50}$/
		},
		postContent: {
			errorMessage: 'blog内容长度为2-10000个字符',
			emptyMessage: 'blog内容为空',
			pattern: /^.{2,10000}$/
		},
		commentContent: {
			errorMessage: '评论长度为2-2000个字符',
			emptyMessage: '评论内容为空',
			pattern: /^.{2,2000}$/
		},
	},
	_validate: function(mapper) {
		var result = "";
		for (var key in mapper) {
			if (mapper[key]) {
				if(!this.beChecked[key].pattern.test(mapper[key]))
					result += this.beChecked[key].errorMessage + '\n';
			} else {
				result += this.beChecked[key].emptyMessage + '\n';
			}
		}
		return result;
	},
	validateRegister: function(input) {
		return this._validate({userAccount:input.account, userPassword: input.password, userName:input.name});
	},
	validateLogin: function(input) {
		return this._validate({userAccount:input.account, userPassword: input.password});
	},
	validatePost: function(input) {
		return this._validate({postTitle: input.title, postContent: input.content});
	},
	validateComment: function(input) {
		return this._validate({commentContent: input.content});
	}
};
module.exports = validator;