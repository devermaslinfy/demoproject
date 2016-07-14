'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.value('editMode', '')
.controller('UserCtrl', function ($sessionStorage,DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state,$stateParams) {

console.log( $state.params);
    var vm = this;
    $scope.editMode = '';
    $scope.showEditMode = '';
    if($stateParams.editMode === false | $stateParams.editMode === true){
         $sessionStorage.editMode = $stateParams.editMode;
    } else{
        $sessionStorage.editMode = $sessionStorage.editMode;
    }

    //$sessionStorage.editMode = $stateParams.editMode === false ? $stateParams.editMode : $sessionStorage.editMode ;
    console.log($sessionStorage.editMode);
    var editMode = $sessionStorage.editMode;
    if (editMode === false ){
        //console.log($stateParams.editMode);
        $scope.showEditMode = false;
        $scope.editMode = false;
    } else {
        //console.log($stateParams.editMode);
        $scope.showEditMode = true;
        $scope.editMode = true;
    }
    
    $scope.editMod = function(){
        var val = $scope.editMode;
        $scope.editMode = !val;
    }
    $scope.email = '';
/*    vm.getUser = getUser;
    function getUser(){
            $http({
  method: 'GET',
  url: 'api/users'
}).then(function successCallback(response) {
    return response;
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
    }*/

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/users').query().$promise;
        })
    	//.withDOM('frtip')
    	//.withDOM('&lt;\'row\'&lt;\'col-xs-6\'l&gt;')
        // Add Bootstrap compatibility
        .withBootstrap()
        .withBootstrapOptions({
/*            TableTools: {
                classes: {
                    container: 'btn-group',
                    buttons: {
                        normal: 'btn btn-danger'
                    }
                }
            },
            ColVis: {
                classes: {
                    masterButton: 'btn btn-primary'
                }
            },*/
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
        // Active Buttons extension
/*        .withButtons([
            //'columnsToggle',
            //'colvis',
            //'copy',
           'print',
            'excel',
            {
                text: 'Add User',
                key: '1',
                action: function (e, dt, node, config) {
                    alert('Button activated');
                }
            }
        ]);*/
       // .withOption('bFilter', false)
       // .withOption('bSearchable', false)
        //.withDOM('<"bottom"p><"clear">');
       //.withDOM('<"top"i>rt<"bottom"flp><"clear">');
        //console.log(vm.dtOptions);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('Name'),
        DTColumnBuilder.newColumn('email').withTitle('Email'),
        DTColumnBuilder.newColumn('age').withTitle('Age'),
        DTColumnBuilder.newColumn('add_date').withTitle('Joined Date'),
        DTColumnBuilder.newColumn('last_login').withTitle('Last Activity'),
        DTColumnBuilder.newColumn('login_type').withTitle('Login Type').renderWith(function(data, type, full, meta){
            if(data == 1){
                return 'Social';
            } else{
                return 'Email';
            }
        }),
        DTColumnBuilder.newColumn(null).withTitle('Number Like').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn(null).withTitle('Number of Favorites').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(function(data){
            if(data == 1){
                return 'Active';
            } else if (data == 2){
                return 'Ban';
            } else {
                return 'Pending';
            }
        }),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
            	console.log(data);
            	//<a ui-sref="details({index: $index})
/*            	a='<a class="btn btn-block btn-social " ui-sref="dashboard.form({index: '+"'"+data._id+"'"+'})">'
                               <i class="fa fa-edit"></i>
                            </a>';
            	data._id = ''+data._id;*/
                return '<a class="btn btn-warning" ui-sref="dashboard.form({id: '+"'"+data._id+"'"+',editMode:true})" ng-click="edit('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>&nbsp;' +
                    '<button class="btn btn-info" ng-click="status('+"'"+data._id+"'"+')">' +
                    '   <i id="icon_'+data._id+'" class="fa fa-check"></i>' +
                    '</button>';
            })
    ];
    $scope.edit = function(id) {
        console.log('Editing ' + id);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        confirm("Do you want to delete,User?");
        console.log('Deleting' + id);
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.dtInstance = {};
    vm.dtIntanceCallback = function (instance) {
        vm.dtInstance = instance;
    }

    $scope.addUser = function() {
        $state.go('dashboard.form',{'id':'','editMode':false});
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    //console.log($scope.showEditMode);
    $scope.status = function(id) {
        console.log('Status' + id);
/*        if ($scope.class === "fa-check")
              $scope.class = "fa-times";
            else
              $scope.class = "fa-check";*/
          var myEl = angular.element( document.querySelector( '#icon_'+id ) );
          if(myEl.hasClass('fa-check')){
            myEl.addClass('fa-times');
            myEl.removeClass('fa-check');
          } else {
            myEl.addClass('fa-check');
            myEl.removeClass('fa-times');
          }
          

    };

$scope.editlog = function(val){
     var myEl = angular.element( document.querySelector( '#'+val ) );
     if(myEl.hasClass('fa-check')){
            myEl.addClass('fa-times');
            myEl.removeClass('fa-check');
          } else {
            myEl.addClass('fa-check');
            myEl.removeClass('fa-times');
          }
}
$scope.user ={};
// calling our submit function.
$scope.submitForm = function() {
// Posting data to php file
$http({
  method  : 'POST',
  url     : 'clone.php',
  data    : $scope.user, //forms user object
  headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
 })
  .success(function(data) {
    if (data.errors) {
      // Showing errors.
      $scope.errorName = data.errors.name;
      $scope.errorUserName = data.errors.username;
      $scope.errorEmail = data.errors.email;
    } else {
      $scope.message = data.message;
    }
  });
}
            
})
.controller('ClientCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state) {


    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/clients').query().$promise;
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
        DTColumnBuilder.newColumn('name').withTitle('Client Name'),
        DTColumnBuilder.newColumn('address').withTitle('City').renderWith(cityHtml),
        DTColumnBuilder.newColumn(null).withTitle('Buisness Type').renderWith(businessHtml),
        DTColumnBuilder.newColumn(null).withTitle('Number of Views').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn(null).withTitle('Number Like').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn(null).withTitle('Number of Favorites').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn('add_date').withTitle('Join Date'),
        DTColumnBuilder.newColumn('add_date').withTitle('Last Visit'),
        //DTColumnBuilder.newColumn('image_url').withTitle('Image').renderWith(imageHtml),
       // DTColumnBuilder.newColumn('category').withTitle('Category').renderWith(categoryHtml),
       // DTColumnBuilder.newColumn('address').withTitle('Address').renderWith(addressHtml),
       // DTColumnBuilder.newColumn('phone').withTitle('Phone'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                //console.log(data._id);
                //<a ui-sref="details({index: $index})
/*              a='<a class="btn btn-block btn-social " ui-sref="dashboard.form({index: '+"'"+data._id+"'"+'})">'
                               <i class="fa fa-edit"></i>
                            </a>';
                data._id = ''+data._id;*/
                return '<a class="btn btn-warning" ui-sref="dashboard.clientform({index: '+"'"+data._id+"'"+'})" ng-click="edit('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>&nbsp;' +
                    '<button class="btn btn-info" ng-click="status('+"'"+data._id+"'"+')">' +
                    '   <i id="icon_'+data._id+'" class="fa fa-check"></i>' +
                    '</button>';
            })
    ];
    function businessHtml(data, type, full, meta){
        return 'Sports';
    }
    function imageHtml(data, type, full, meta) {
        console.log(data);
        return '<img height="100px" width="100px" src="images/'+data+'">';
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
    function cityHtml(data, type, full, meta){
        //console.log(data);
        return data.city;
    }
    $scope.edit = function(id) {
        console.log('Editing ' + id);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        confirm("Do you want to delete,Client?");
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.dtInstance = {};
    vm.dtIntanceCallback = function (instance) {
        vm.dtInstance = instance;
    }

    $scope.addClient = function() {
        $state.go('dashboard.clientform');
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.status = function(id) {
        console.log('Status' + id);
/*        if ($scope.class === "fa-check")
              $scope.class = "fa-times";
            else
              $scope.class = "fa-check";*/
          var myEl = angular.element( document.querySelector( '#icon_'+id ) );
          if(myEl.hasClass('fa-check')){
            myEl.addClass('fa-times');
            myEl.removeClass('fa-check');
          } else {
            myEl.addClass('fa-check');
            myEl.removeClass('fa-times');
          }
          

    };


            
});