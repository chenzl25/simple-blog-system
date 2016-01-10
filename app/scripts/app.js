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
      when('/manager', {
        templateUrl: './partials/manager.html',
        controller: 'managerCtrl'
      }).
      when('/manager/:postId', {
        templateUrl: './partials/manager-post-detail.html',
        controller: 'managerPostDetailCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);
