
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

