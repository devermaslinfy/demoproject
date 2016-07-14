(function() {
	'use strict';

	angular
		.module('app.auth.mocks', [
			'ngMockE2E'
		])
		.run(function($httpBackend, authApiMock) {
			$httpBackend.whenGET('/login').respond(authApiMock.windowLogin());
			$httpBackend.whenGET('/html/').passThrough();

		});
})();