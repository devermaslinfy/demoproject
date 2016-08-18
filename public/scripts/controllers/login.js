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
  LoginCtrl.$inject = ['$scope', '$http','$state', '$q', '$localStorage','authApi','$stateParams'];
  function LoginCtrl ($scope,$http,$state,$q,$localStorage,authApi,$stateParams) {
  	$scope.list = [];
  	$scope.status;
  	if($stateParams.id) {
  		$scope.id = $stateParams.id;
  	}
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
					} else {
						$scope.status = response.data.status;
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
	$scope.forgotpass = function(){
		$http.post("admin/forgotpass", {email:$scope.email}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Reset Password Link has been sent, Please Check your email Account!")
                $state.go('login');
            }
        })
        .error(function(error){
            console.log(error);
        });
	}
	$scope.resetpass = function(){

		$http.post("admin/resetpass", {id:$scope.id,password:$scope.password}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Your password has been reset, Please Login!")
                $state.go('login');
            }
        })
        .error(function(error){
            console.log(error);
        });
	}
	$scope.logout = function(){
		authApi.logout();
	}
  	}