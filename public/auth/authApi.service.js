(function() {
	'use strict';

	angular
		.module('app.auth')
		.service('authApi', authApi);

	function authApi($http, $q, $localStorage, $state) {
		this.windowLogin = windowLogin;
		this.getToken = getToken;

		function windowLogin() {
			return $q(function(resolve, reject) {
				$http
					.get('/login')
					.then(function(response) {
						setToken(response.data.token);

						resolve();
					}, function(err) {
						reject(err);
					})
			});
		}

		function setToken(token) {
			$localStorage['token'] = token;
		}

		function getToken() {
			return $localStorage['token'];
		}

		function logout() {
			$localStorage['token'] = null;
			$state.go('login');
		}
	}

})();