(function() {
	'use strict';

	angular
		.module('app.auth')

		.factory('tokenInjector', tokenInjector);


	function tokenInjector($q, $localStorage) {
			return {
				request: function(config) {
					var token = $localStorage['token']

					if (token == null || (config.noToken && config.noToken === true)) {
						return config;
					}

					config.headers['x-auth-token'] = token;

					return config;
				},
				response: function(rejection) {
					if (rejection.status == '401') {
				//		authApi.logout();
						return $q.reject(rejection);
					}
				}
			}
	}

})();