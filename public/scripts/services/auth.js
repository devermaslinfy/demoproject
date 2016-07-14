'use strict';

	angular
		.module('sbAdminApp')
		.service('authApi', authApi);

	function authApi($http, $q, $localStorage, $state) {
		this.Login = Login;
		this.getToken = getToken;
		this.logout = logout;
		this.getId = getId;
		this.GetUser = GetUser;

		function Login(email,password) {
			return $q(function(resolve, reject) {
				$http
					.post('api/authenticate',{'email':email,'password':password})
					.then(function(response) {
						console.log(response);
						setToken(response.data.token);
						console.log(response.data.token);
						setId(response.data.id)

						resolve(response);
					}, function(err) {
						reject(err);
					})
			});
		}
		function GetUser() {
			return 
				$http.get('api/admin', {id: getId()})
				.then(function(response) {
						console.log(response);
						return response.data;
						//resolve(response);
					}, function(err) {
						//reject(err);
					})
			}



		function setToken(token) {
			$localStorage['token'] = token;
		}
		function setId(id) {
			$localStorage['id'] = id;
		}
		function getId() {
			return $localStorage['id'];
		}
		function getToken() {
			return $localStorage['token'];
		}

		function logout() {
			$localStorage['token'] = null;
			$localStorage['id'] = null;
			$state.go('login');
		}
	}