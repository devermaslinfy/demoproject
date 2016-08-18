(function() {
	'use strict';

	angular
		.module('sbAdminApp')

		.factory('tokenInjector', tokenInjector);


	function tokenInjector($q, $localStorage,$location) {
			return {
				request: function(config) {
					var token = $localStorage['token']

					if(config.url.indexOf('checkEmailForgot') > 0){

					} else if(config.url.indexOf('forgotpass') > 0){

					}
					else if(config.url.indexOf('resetpass') > 0){
						
					}
					else if (token == null || (config.noToken && config.noToken === true)) {
						//return config;
						$location.path('/login');
					}
					//config.headers['Token'] = $localStorage['token'];
					config.headers['x-access-token'] = token;
					return config;
				},
				responseError: function(response) {
					if(response.status === 102  || response.status === 401 || response.status === 403) {
                        //$location.path('/login');
                    }
                    if(response.status === 200 ){
                    	$location.path('/forgotpass');
                    } else{
                    	return $q.reject(response);
                    }
                    
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