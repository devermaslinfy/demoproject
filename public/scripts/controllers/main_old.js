'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('MainCtrl',["$scope","$http", function($scope,$http) {
        $scope.number = '';
        $scope.totalclient='';
        var getCount = function () {
            $http.get('admin/Count') // PASS THE DATA AS THE SECOND PARAMETER
                .success(
                    function(data){
                      console.log(data);
                        if(data.status == 100){
                          console.log('fgjjjhgj')
                          $scope.number = data.count.user;
                          $scope.totalclient = data.count.client;
                        }
                    })
                .error(
                    function(error){
                        console.log(error)
                    });
        }
        getCount();
        $scope.bar = {
        labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
        series: ['Series A', 'Series B'],

        data: [
           [65, 59, 80, 81, 56, 55, 40],
           [28, 48, 40, 19, 86, 27, 90]
        ]
        
    };
  }])
.controller('AdminCtrl', function (authApi,DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state,$injector,$filter,$stateParams) {


    var vm = this;
    $scope.admin= {};
    $scope.editMode = false;
    $scope.preval = '';
    var $http = $injector.get('$http');
    $scope.setDate = function(datestring) {
        return new Date(datestring);
    };
    if($stateParams.id){
        $scope.editMode = true;
        //$state.go('dashboard.businessform');
        var id = $stateParams.id;
        $http.get("admin/admin/"+id)
        .success(function(data){
            console.log(data);
            $scope.admin = data;
            angular.forEach(data, function (value, prop) {  
                if(typeof value == "object" && prop == "admin"){
                    $scope.admin = value;
                    $scope.preval = $scope.admin.email;
                }
            });

        })
        .error(function(){
        });
    }
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('admin/admins').query().$promise;
        })
    	//.withDOM('frtip')
    	//.withDOM('&lt;\'row\'&lt;\'col-xs-6\'l&gt;')
        // Add Bootstrap compatibility
        .withBootstrap()
        .withBootstrapOptions({
            pagination: {
                classes: {
                    ul: 'pagination pagination-sm'
                }
            }
        })
        .withPaginationType('full_numbers')
        // Add ColVis compatibility
        //.withColVis()
        .withOption('createdRow', function(row, data, dataIndex) {
              $compile(angular.element(row).contents())($scope);
      	})
      	.withOption('initComplete', function() {
		   angular.element('#DataTables_Table_0_filter').css('display', 'inline-block').css('float','right');
		   angular.element('#DataTables_Table_0_length').css('display', 'inline-block');
		})

    vm.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('Name'),
        DTColumnBuilder.newColumn('email').withTitle('Email'),
        //DTColumnBuilder.newColumn('avtar').withTitle('Image').renderWith(imageHtml),
        DTColumnBuilder.newColumn('last_login').withTitle('Last Login').renderWith(function(data){
            if(data){
                var data = $scope.setDate(data);
                return data ? $filter('date')(data, 'dd-MM-yyyy') : 'Not Login Yet!';
            } else {
                return 'Not Login Yet!';
            }
  
        }),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                //console.log(data._id);
                //<a ui-sref="details({index: $index})
/*              a='<a class="btn btn-block btn-social " ui-sref="dashboard.form({index: '+"'"+data._id+"'"+'})">'
                               <i class="fa fa-edit"></i>
                            </a>';
                data._id = ''+data._id;*/
                return '<a class="btn btn-warning" ui-sref="dashboard.adminform({id: '+"'"+data._id+"'"+'})">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>';
            })
    ];
    function imageHtml(data, type, full, meta) {
        console.log(data);
        return '<img height="100px" width="100px" src="images/client/'+data+'">';
    }
    function categoryHtml(data, type, full, meta) {
        return data.name;
     }
    function addressHtml(data, type, full, meta) {
        var address = '<address>';
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var val = data[key];
            if(key == 'street'){
                address += '<strong>'+val+'</strong>';
            } 
            else {
                address += '<br>'+val;
            }
          }
        }
        address += '<address>';
        return address;
    }
    $scope.setpassword = function() {
        var id = authApi.getId();
        $http.post("admin/updateAdminPassword", {password:$scope.password,id:id}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Your password has been updated successfully!")
                $state.go('dashboard.home');
            }
        })
        .error(function(error){
            console.log(error);
        });
    };
    $scope.edit = function() {
        $http.post("admin/updateAdmin", {data:$scope.admin}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Admin has been updated successfully!")
                $state.go('dashboard.admins');
            }
        })
        .error(function(error){
            console.log(error);
        });
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.profile = function() {
        $http.post("admin/updateAdmin", {data:$scope.admin}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Admin profile has been updated successfully!")
                $state.go('dashboard.home');
            }
        })
        .error(function(error){
            console.log(error);
        });
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        var res = confirm("Do you want to delete,Admin?");
        if(res){
            var res = confirm("Are you sure to delete,Admin?")
            if(res){
                $http.get("admin/deleteAdmin/"+id)
                .success(function(data){
                    console.log(data);
                    if(data.status == 100){
                        //alert("User has been deleted successfully!");
                        //document.getElementById(id).parentNode.parentNode.remove();
                        vm.reloadData();
                    }

                //$state.go('dashboard.viewUser',{user:$scope.user});
                })
                .error(function(){
                });
            }
        }
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    vm.dtInstanceCallback = dtInstanceCallback;
    function dtInstanceCallback (DTInstances) {
        vm.dtInstance = DTInstances;
    }
    // Reload the datatable
    function reloadData(type,id) {

        var resetPaging = false;
        vm.dtInstance.reloadData(callback, resetPaging);
        //console.log(res);
    };  
    function callback(json) {

        //console.log(json);
    };

    $scope.addAdmin = function() {
        $state.go('dashboard.adminform');
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    // Save admin
    $scope.save = function(){
/*        console.log($scope.question);
        var answer = [];
        angular.forEach($scope.question.answer, function (value, prop) {  
            answer.push(value);
        });
        $scope.question.finalanswer = answer;*/
      $http.post("admin/addAdmin", {data:$scope.admin}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Admin has been added successfully!")
                $state.go('dashboard.admins');
            }
        })
        .error(function(error){
            console.log(error);
        });
    }

            
})