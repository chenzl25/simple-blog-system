
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
  'blogControllers',
  'blogServices',
  'ngAnimate'
  // 'blogAnimations'
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
      when('/home/page/:page', {
        templateUrl: './partials/home.html',
        controller: 'homeCtrl'
      }).
      when('/user/post/:postId', {
        templateUrl: './partials/user-post-detail.html',
        controller: 'userPostDetailCtrl'
      }).
      when('/home/post/:postId', {
        templateUrl: './partials/home-post-detail.html',
        controller: 'homePostDetailCtrl'
      }).
      when('/manager', {
        templateUrl: './partials/manager.html',
        controller: 'managerCtrl'
      }).
      when('/manager/post/:postId', {
        templateUrl: './partials/manager-post-detail.html',
        controller: 'managerPostDetailCtrl'
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
            if (data.userData.isManager) {
              $location.url('/home/page/1');
            } else {
              $location.url('/user');
              // $location.url('/home/page/1'); // debug use
            }
          }
        });
      }
    }
    //*****************************
    // $scope.account = '14331048';
    // $scope.password = '14331048';
    // $scope.login();
    //*****************************
    //*****************************
    // $scope.account = 'manager';
    // $scope.password = 'manager';
    // $scope.login();
    //*****************************
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
    $scope.superRegister = function() {
      var validateResult = validator.validateRegister({account: $scope.account, password: $scope.password, name: $scope.name});
      if ($scope.password !== $scope.again) {
        validateResult += '两次输入密码不相同\n';
      }
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/Mapi/register', {account:$scope.account,password:$scope.password,name:$scope.name}).success(function(data) {
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

blogControllers.controller('userCtrl', ['$scope','$http','validator','$rootScope','$location','$sce',
  function($scope, $http, validator, $rootScope, $location,$sce) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.enterPostDetail = function(postData) {
      $rootScope.postData = postData;
      $location.url('/user/post/'+postData._id);
    }
    $scope.title = ''
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
            $scope.title = '';
            $scope.content = '';
          }
        });
      }
    }
  }]);


blogControllers.controller('userPostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location,$routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.beforeTitle = $rootScope.postData.title;
    $scope.beforeContent = $rootScope.postData.content;
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
            $scope.content = '';
          }
        });
      }
    }
    $scope.editState = false;
    $scope.messageClass = '';
    $scope.message = '';
    $scope.editStateHandler = function() {
      $scope.editState = !$scope.editState;
      $rootScope.postData.title = $scope.beforeTitle;
      $rootScope.postData.content = $scope.beforeContent;

    }
    $scope.editPost = function() {
      var validateResult = validator.validatePost({title: $rootScope.postData.title,content: $rootScope.postData.content});
      if (validateResult) {
        $scope.anotherMessageClass = 'warning';
        $scope.anotherMessage = validateResult;
      } else {
        $http.put('/proxy/api/post/'+$routeParams.postId, {title: $scope.postData.title, content: $scope.postData.content}).success(function(data) {
          if (data.error) {
            $scope.anotherMessageClass = 'warning';
            $scope.anotherMessage = data.message;
          } else {
            $scope.anotherMessageClass = 'success';
            $scope.anotherMessage = '';
            $scope.editState = false;
            $rootScope.postData = data.postData;
            $scope.beforeTitle = $rootScope.postData.title;
            $scope.beforeContent = $rootScope.postData.content;
            var key = null;
              $rootScope.userData.posts.find(function(v,k) {
                if (v._id == $routeParams.postId) {
                  key = k;
                }
              })
              if (key != null) {
                $rootScope.userData.posts.splice(key, 1);
                $rootScope.userData.posts.unshift(data.postData);
              }
          }
        });
      }
    }
    $scope.deletePost= function() {
      if (window.confirm('Sure to delete the Post?')) {
          $http.delete('/proxy/api/post/'+$routeParams.postId).success(function(data) {
            if (data.error) {
              $scope.messageClass = 'warning';
              $scope.message = data.message;
            } else {
              $scope.messageClass = 'success';
              $scope.message = '';
              $scope.editState = false;
              $rootScope.postData = data.postData;
              var key = null;
              $rootScope.userData.posts.find(function(v,k) {
                if (v._id == $routeParams.postId) {
                  key = k;
                }
              })
              if (key != null)
                $rootScope.userData.posts.splice(key, 1);
              $location.url('/user')
            }
        });
      }
    }
  }]);

blogControllers.controller('homeCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location,$routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }

    $scope.queryPosts = function(query) {
      $http.get('/proxy/api/posts?query=' + query).success(function(data) {
        if (data.error) {
          alert(data.message); // modify later
        } else {
          $rootScope.postsData = data.postsData;
          $scope.totalPosts = data.total;
          $scope.postsEachPage = data.eachPage;
          $scope.totalPages = Math.ceil($scope.totalPosts/$scope.postsEachPage);
          $scope.pagesArray = [];
          // for (var i = 1; i <= $scope.totalPages; i++) {
          //   $scope.pagesArray.push(i);
          // }
          $scope.currentPage = $routeParams.page;
          // 10 pages per group
          $scope.totalGroups = Math.ceil($scope.totalPages / 10);
          $scope.currentGroup = Math.ceil($scope.currentPage / 10);
          $scope.prePage = undefined;
          $scope.sufPage = undefined;
          if ($scope.currentGroup > 1) {
            $scope.prePage = ($scope.currentGroup-1)*10;
          }
          if ($scope.currentGroup < $scope.totalGroups) {
            $scope.sufPage = ($scope.currentGroup*10)+1;
          }
          for (var i = ($scope.currentGroup-1)*10+1;i <= $scope.currentGroup*10 && i <= $scope.totalPages; i++) {
            $scope.pagesArray.push(i);
          }
        }
      });
    }
    $scope.queryPosts($routeParams.page);
    $scope.enterPostDetail = function(postData) {
      $rootScope.postData = postData;
      if ($rootScope.userData.isManager) {
        $location.url('/manager/post/'+postData._id);
      } else {
        $location.url('/home/post/'+postData._id);
      }
    }
  }]);

blogControllers.controller('homePostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location, $routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
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
            $scope.content = '';
          }
        });
      }
    }
  }]);

// blogControllers.controller('managerCtrl', ['$scope','$http','validator','$rootScope','$location',
//   function($scope, $http, validator, $rootScope, $location) {
//     if (!$rootScope.userData) {
//       $location.url('/login');
//     }
//     $http.get('/proxy/api/posts').success(function(data) {
//       $rootScope.postsData = data.postsData;
//     });
//     $scope.enterPostDetail = function(postData) {
//       $rootScope.postData = postData;
//       $location.url('/manager/post/'+postData._id);
//     }
//   }]);
blogControllers.controller('managerPostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location, $routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.postForbiddenSwitch = function() {
      $http.put('/proxy/Mapi/post/'+$routeParams.postId).success(function(data) {
        if (data.error) {
          alert(data.message);
        } else {
          console.log(data);
          // var key = null;
          // $rootScope.postsData.find(function(v,k) {
          //   if (v._id === $routeParams.postId) {
          //     key = k;
          //   }
          // });
          // if (key !== null) {
          //   $rootScope.postsData[key] = data.postData;
          // }
          $rootScope.postData = data.postData;
        }
      });
    }
    $scope.commentForbiddenSwitch = function(commentId) {
      $http.put('/proxy/Mapi/post/'+$routeParams.postId+'/comment/' +commentId).success(function(data) {
        if (data.error) {
          alert(data.message);
        } else {
          // var key = null;
          // $rootScope.postsData.find(function(v,k) {
          //   if (v._id === $routeParams.postId) {
          //     key = k;
          //   }
          // });
          // if (key !== null) {
          //   $rootScope.postsData[key] = data.postData;
          // }
          var key = null;
          $rootScope.postData.comments.find(function(v,k) {
            if (v._id === commentId) {
              key = k;
            }
          });
          if (key !== null) {
            $rootScope.postData.comments[key] = data.commentData;
          }
        }
      });
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