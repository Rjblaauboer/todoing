'use strict';

describe('Service: trelloader', function () {

  // load the service's module
  beforeEach(module('todoingApp'));

  // instantiate service
  var trelloader;
  beforeEach(inject(function (_trelloader_) {
    trelloader = _trelloader_;
  }));

  it('should do something', function () {
    expect(!!trelloader).toBe(true);
  });

});
