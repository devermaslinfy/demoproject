'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LoginCtrl',LoginCtrl);
  LoginCtrl.$inject = ['$scope', '$http','$state', '$q', '$localStorage','authApi'];
  function LoginCtrl ($scope,$http,$state,$q,$localStorage,authApi) {
  	$scope.list = [];
  	$scope.submit = function() {
  		 if ($scope.email) {
          $scope.list.push($scope.email);
          console.log($scope.email);
        }
        			authApi
				.Login($scope.email,$scope.password)
				.then(function(response) {
					if(response.data.status == 100){
						$state.go('dashboard.home');
					}
				})
				.catch(function(err) {
					$state.go('login');
				});
/*				$http.post('api/authenticate',{'email':$scope.email,'password':$scope.password}).success(function(data, status) {
	            console.log(data);
	            $localStorage['token'] = data.token;
	            $state.go('dashboard.home');*/
	        }
	$scope.logout = function(){
		authApi.logout();
	}
  	}