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
