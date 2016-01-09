
/* Services */

var phonecatServices = angular.module('blogServices', ['ngResource']);

phonecatServices.factory('POST', ['$resource',
  function($resource){
    return $resource('api/', {}, {
      query: {method:'GET', params:{phoneId:'posts'}, isArray:true},

    });
  }]);
