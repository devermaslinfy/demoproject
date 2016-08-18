'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){
		return {
		scope: {
      		adminId: '='
    	},
		controller: function($scope, authApi){
        var vm = this;
        // accessing the directive's scope variable
        

        vm.adminId = authApi.getId();
    	},
    	controllerAs: 'vm',
        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
    	}
	});


