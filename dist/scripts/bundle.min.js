
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
      when('/', {
        templateUrl: './partials/home.html',
        controller: 'homeCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


var blogControllers = angular.module('blogControllers', []);

blogControllers.controller('homeCtrl', ['$scope','$http',
  function($scope, $http) {
    $scope.home = 'home_yeye';
    $scope.blogs = [
      {'title': 'Nexus S',
       'content': 'Fast just got faster with Nexus S.'},
      {'title': 'Motorola XOOM™ with Wi-Fi',
       'content': 'The Next, Next Generation tablet.'},
      {'title': 'MOTOROLA XOOM™',
       'content': 'The Next, Next Generation tablet.'}
    ]
    // $http.get('api/posts').success(function(data) {
    //   $scope.res = data;
    // });
    $scope.res = '-_-';
    // return $http.get('/proxy/localhost:3000/api/posts').success(function(data) {
    //   $scope.res = data;
    // })
    $http.post('/proxy/api/login', {account:'14331048',password:'14331048'}).success(function(data) {
      $scope.res = data;
    });
    // $http.post('/proxy/localhost:3000/api/register', {account:'14331048',password:'14331048'}).success(function(data) {
    //   $scope.haha = data;
    // });
    $http.put('/proxy/api/post/5690a4933f28fa85406d344f', {content:'14331048',title:'14331048'}).success(function(data) {
      $scope.haha = data;
    });
  }]);



/* Directives */

/* Filters */

angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});


/* Services */

var phonecatServices = angular.module('blogServices', ['ngResource']);

phonecatServices.factory('POST', ['$resource',
  function($resource){
    return $resource('api/', {}, {
      query: {method:'GET', params:{phoneId:'posts'}, isArray:true},

    });
  }]);
