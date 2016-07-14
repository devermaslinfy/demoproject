'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebar',['$location','$http','authApi',function($http,authApi) {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope,$http,authApi){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.collapseVar1 = 0;
        $scope.collapseVar2 = 0;
        $scope.multiCollapseVar = 0;
        $scope.superAdmin = false;
        //console.log(authApi.getId())
        var idd = authApi.getId();
        var data = {id: idd};
        $http.get('api/admin', {params:data}) // PASS THE DATA AS THE SECOND PARAMETER
            .success(
                function(data){
                    if(data.admin_type === 1){
                      $scope.superAdmin = true;
                    }
                })
            .error(
                function(error){
                    console.log(error)
                });
        $scope.check = function(x){
          console.log("x is" + $scope.collapseVar)
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        $scope.check1 = function(x){
          console.log("x is" + $scope.collapseVar1)
          if(x==$scope.collapseVar1)
            $scope.collapseVar1 = 0;
          else
            $scope.collapseVar1 = x;
        };
        $scope.check2 = function(x){
          console.log("x is" + $scope.collapseVar2)
          if(x==$scope.collapseVar2)
            $scope.collapseVar2 = 0;
          else
            $scope.collapseVar2 = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };
      }
    }
  }]);
