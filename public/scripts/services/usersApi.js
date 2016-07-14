'use strict';

	angular
		.module('sbAdminApp')
		.service('usersApi', usersApi);
	function usersApi($http, $q, $localStorage, $state){
		this.listUsers = listUsers;
		function listUsers(){
			return $q(function(resolve, reject) {
				$http
					.get('api/users')
					.then(function(response) {
						//setToken(response.data.token);

						resolve(response);
					}, function(err) {
						reject(err);
					})
			});
		}
	}

angular.module('sbAdminApp').factory('filterService', filterService);

filterService.$inject = ['$q','$http'];
function filterService($q){

    var service = {
        execute: execute
    };

    return service;


    function execute(start, length, order){

        var defered = $q.defer();

        //Make a request to backend api and then call defered.resolve(result);
        $q(function(resolve, reject) {
				$http
					.get('api/users')
					.then(function(response) {
						//setToken(response.data.token);

						resolve(response);
					}, function(err) {
						reject(err);
					})
			});

        return defered.promise;
    }
}