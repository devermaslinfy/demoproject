(function() {
	'use strict';

	angular
		.module('app.auth')
		.controller('loginCtrl', loginCtrl);

	function loginCtrl($scope,
										$state,
										authApi) {
		this.login = login;

		/**
		 * Login
		 */
		function login() {
			authApi
				.windowLogin()
				.then(function() {
					$state.go('main.transactions.summary');
				})
				.catch(function(err) {
					alert('Error while login');
				});
		}
	}

})();