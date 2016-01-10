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