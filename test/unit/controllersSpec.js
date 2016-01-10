
describe('homeCtrl', function(){

  beforeEach(angular.mock.module('blogApp'));

  it('should create "phones" model with 3 phones', angular.mock.inject(function($controller) {
    var scope = {},
        ctrl = $controller('homeCtrl', {$scope:scope});

    expect(scope.blogs.length).toBe(3);  
  }));
});
