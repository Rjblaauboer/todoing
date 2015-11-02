'use strict';

describe('Directive: todoingCard', function () {

  // load the directive's module
  beforeEach(module('todoingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<todoing-card></todoing-card>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the todoingCard directive');
  }));
});
