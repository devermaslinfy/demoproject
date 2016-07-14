(function() {
	'use strict';

	angular
		.module('sbAdminApp')

		.factory('tokenInjector', tokenInjector);


	function tokenInjector($q, $localStorage,$location) {
			return {
				request: function(config) {
					var token = $localStorage['token']
					//console.log(token);
					if (token == null || (config.noToken && config.noToken === true)) {
						//return config;
						$location.path('/login');
					}
					//config.headers['Token'] = $localStorage['token'];
					config.headers['x-access-token'] = token;
					return config;
				},
				responseError: function(response) {
					if(response.status === 102  || response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
				//	if (rejection.status == '401') {
				//		authApi.logout();
					//	return $q.reject(rejection);
					//}
				}
			}
/*			$httpProvider.interceptors.push(function($q,$localStorage,$location ) {
		    return {
		     'request': function(config) {

		          	var token = $localStorage['token']
					//console.log(token);
					if (token == null || (config.noToken && config.noToken === true)) {
						//return config;
						$location.path('/login');
					}
					config.headers['Token'] = $localStorage['token'];
					config.headers['x-access-token'] = token;
					return config;
		      },
		      responseError: function(response) {
					if(response.status === 102  || response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
				}
		    };
		  });*/
	}

})();