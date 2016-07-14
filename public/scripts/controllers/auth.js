function() {
	'use strict';

	angular
		.module('app.auth', [

		])
		.config(function($stateProvider) {
			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'index.html',
					controller: 'loginCtrl',
					controllerAs: 'vm'
				});
		})
		.config(httpInterceptorConfig);

	function httpInterceptorConfig($httpProvider) {
		$httpProvider.interceptors.push('tokenInjector');
	}

})();