(function() {
	'use strict';

	angular
		.module('app.auth.mocks')
		.service('authApiMock', function($timeout, $q) {
			this.windowLogin = function() {
				return {token: 'MY-FAKE-TOKEN'};
			}
		});

})();