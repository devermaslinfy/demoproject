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
.controller('UserCtrl', function (Upload,$window,$sessionStorage,$scope,$timeout,DTOptionsBuilder,DTColumnBuilder,$compile,$resource,$state,$stateParams,$injector,$rootScope,$filter) {

//console.log( $state.params);
    $scope.user ={};
    $scope.imageShow = true;
    $scope.deleteId = '';
    $scope.social = false;
    if($stateParams.social === true ){
         //localStorage.removeItem("user");
         //console.log($stateParams.social);
         $sessionStorage.social = $stateParams.social;
         $scope.social = $stateParams.social;
    } else{
        $sessionStorage.social = $sessionStorage.social;
        $scope.social = $sessionStorage.social;
    }
    $scope.dateOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        //minDate: new Date(),
        startingDay: 1
    };
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd-MM-yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
    //$scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.setDate = function(datestring) {
        return new Date(datestring);
    };

    var vm = this;
    var $http = $injector.get('$http');
    $scope.editMode = '';
    $scope.showEditMode = '';
    if($stateParams.editMode === false | $stateParams.editMode === true){
         //localStorage.removeItem("user");
         console.log($stateParams.editMode);
         $sessionStorage.editMode = $stateParams.editMode;
    } else{
        $sessionStorage.editMode = $sessionStorage.editMode;
    }
     if($stateParams.user){
        $scope.user = $stateParams.user;
        localStorage.setItem("user", JSON.stringify($stateParams.user));
        //console.log(localStorage.getItem("user"));
     } else if(!$stateParams.editMode) {
        $scope.user = JSON.parse(localStorage.getItem("user"));
        if($scope.user){
            $scope.user.add_date = $scope.setDate($scope.user.add_date);
            $scope.user.last_login = $scope.user.last_login ? $scope.setDate($scope.user.last_login):'';
        }

     }

    //$sessionStorage.editMode = $stateParams.editMode === false ? $stateParams.editMode : $sessionStorage.editMode ;
    //console.log($sessionStorage.editMode);
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
    //var responsive = {details: {renderer: vm.rendererRows}};
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {

            return $resource('api/users').query().$promise;
            //return $resource('api/users');
        })
    	//.withDOM('frtip')
    	//.withDOM('&lt;\'row\'&lt;\'col-xs-6\'l&gt;')
        // Add Bootstrap compatibility
        //.withDOM('&lt;\'row\'&lt;\'col-xs-6\'l&gt;&lt;\'col-xs-6\'f&gt;r&gt;t&lt;\'row\'&lt;\'col-xs-6\'i&gt;&lt;\'col-xs-6\'p&gt;&gt;')
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
       .withOption('responsive', true)
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
        DTColumnBuilder.newColumn(null).withTitle('Likes').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn(null).withTitle('Favorites').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn('add_date').withTitle('Joined Date').renderWith(function(data){
            var data = $scope.setDate(data);
            return data ? $filter('date')(data, 'dd-MM-yyyy') : '';
        }),
/*        DTColumnBuilder.newColumn('last_login').withTitle('Last Activity'),*/
        DTColumnBuilder.newColumn('login_type').withTitle('Login Type').renderWith(function(data, type, full, meta){
            if(data == 1){
                return 'Social';
            } else{
                return 'Email';
            }
        }),

        DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(function(data){
            if(data == 1){
                return 'Active';
            } else if (data == 2){
                return 'Ban';
            } else {
                return 'Pending';
            }
        }).withClass('all'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                var show = '';
                if(data.status == 1){
                    show = 'fa-check';
                } else {
                    show = 'fa-times';
                }
                return '<button style="margin-bottom:5px;" class="btn btn-warning" ng-click="edit('+"'"+data._id+"'"+',editMode = true)">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;' +
                    '<button style="margin-bottom:5px; width: 40px;" id="'+data._id+'" class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>&nbsp;' +
                    '<button style="margin-bottom:5px; width: 40px;" class="btn btn-info" ng-click="status('+"'"+data._id+"'"+')">' +
                    '   <i id="icon_'+data._id+'" class="fa '+show+'"></i>' +
                    '</button>';
            }).withClass('all')
    ];
    //vm.newPromise = newPromise;
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    vm.dtInstanceCallback = dtInstanceCallback;
    function dtInstanceCallback (DTInstances) {
        vm.dtInstance = DTInstances;
    }
/*    DTInstances.getLast().then(function(instance) {
        vm.dtInstance = instance;
    });*/
    // Reload the datatable
    function reloadData(type,id) {

        var resetPaging = false;
        vm.dtInstance.reloadData(callback, resetPaging);
        //vm.dtInstance.rerender(callback, resetPaging);
        //console.log(res);
    };  

    function callback(json) {
/*        if($scope.deleteId){
            console.log('delete me'+$scope.deleteId);
            var index = -1; 
            var id = $scope.deleteId;    
            //var comArr = eval( $scope.companies );
            for( var i = 0; i < json.length; i++ ) {
                if( json[i]._id === id ) {
                    index = i;
                    break;
                }
            }
            if( index === -1 ) {
                alert( "User has not deleted." );
            }
            json.splice( index, 1 );    
        }*/
        //console.log(json);
    };
    $scope.edit = function(id,editMode) {
        if(editMode === false | editMode === true){
             $sessionStorage.editMode = editMode;
        } else{
            $sessionStorage.editMode = $sessionStorage.editMode;
        }
        console.log('Editing ' + editMode);
        $http.get("api/user/"+id)
        .success(function(data){

        angular.forEach(data, function (value, prop) {  
            if(typeof value == "object" && prop == "response"){
                 $scope.user = value;
            }
        });
        
        $scope.user.add_date = $scope.setDate($scope.user.add_date);
        $scope.user.last_login = $scope.user.last_login ? $scope.setDate($scope.user.last_login):'';
        if($scope.user.login_type == 1){
            console.log($scope.user.login_type);
            $scope.social = true;
        }
        console.log($scope.user.add_date);
        $state.go('dashboard.viewUser',{user:$scope.user,social:$scope.social});
        })
        .error(function(){
        });
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };

    $scope.delete = function(id) {
        var res = confirm("Do you want to delete,User?");
        if(res){
            var res = confirm("Are you sure to delete,User?")
            if(res){
                //var type='';
                //vm.reloadData();
                $scope.deleteId = id;
                
                console.log('Deleting' + id );
                //var data = { id : id};
                $http.get("admin/deleteUser/"+id)
                .success(function(data){
                    console.log(data);
                    if(data.status == 100){
                        alert("User has been deleted successfully!");
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
    $scope.addUser = function() {
        localStorage.removeItem("user");
        $state.go('dashboard.form',{'id':'','editMode':false});
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    //console.log($scope.showEditMode);
    $scope.status = function(id) {
        var res = confirm("Do you want to Change Status,User?");
        if(res){
            console.log('Status' + id);
            var myEl = angular.element( document.querySelector( '#icon_'+id ) );
            $http.get("admin/statusUser/"+id)
            .success(function(data){
                console.log(data);
                if(data.status == 100){
                    if(myEl.hasClass('fa-check')){
                        myEl.addClass('fa-times');
                        myEl.removeClass('fa-check');
                    } else {
                        myEl.addClass('fa-check');
                        myEl.removeClass('fa-times');
                    }
                    vm.reloadData();
                }
            })
            .error(function(){
            });
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


// get $http via $injector because of circular dependency problem
$http = $http || $injector.get('$http');



            //an array of files selected
    $scope.files = [];

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            console.log(args.file);
            $scope.files.push(args.file);
        });
    });

    
    //fileUpload.uploadFileToUrl(file);
    $scope.save = function(file){
        console.log('register');
        if(file === undefined || file == null || file == ''){
            $http.post("admin/register", {user:$scope.user}, {
                headers: {'Content-Type': 'application/json'}
            })
            .success(function(res){
                if(res.status == 100){
                    alert("User has been added successfully!")
                    $state.go('dashboard.users');
                }
            })
            .error(function(error){
                console.log(error);
            });
        } else {
            file.upload = Upload.upload({
              url: 'admin/register',
              data: {user: $scope.user, avtar: file},
            });
            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
                    if(file.result.status == 100){
                        alert("User has been added successfully!")
                        $state.go('dashboard.users');
                    }
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }


    }

    $scope.updateUser = function(file){
        if(file === undefined || file == null || file == ''){
            $http.post("admin/updateUser", {user:$scope.user}, {
                headers: {'Content-Type': 'application/json'}
            })
            .success(function(res){
                if(res.status == 100){
                    alert("User has been updated successfully!")
                    $state.go('dashboard.users');
                }
            })
            .error(function(error){
                console.log(error);
            });
        } else{
            file.upload = Upload.upload({
              url: 'admin/updateUser',
              data: {user: $scope.user, avtar: file},
            });
            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
                    if(file.result.status == 100){
                        alert("User has been updated successfully!")
                        $state.go('dashboard.users');
                    }
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    }
    if($scope.user){   
        $rootScope.email = $scope.user.email;
    }
            
})
.controller('ClientCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state,$stateParams,$injector,Upload,$timeout,$filter) {


    var vm = this;
    var $http = $injector.get('$http');
    $scope.categories = [];
    $scope.business =[];
    $scope.client = {};
    $scope.client.address = {"country":"United State"};
    $scope.editMode=false;
    $scope.maxlength = 1024*4;
    $scope.phone_regexp = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
    console.log($state.this);
    vm.getBusinessCategory = function(){
        $http.get("api/categories/")
        .success(function(data){
            //console.log(data);
            $scope.categories = data;

        })
        .error(function(){
            //$scope.category=[];
        });
        $http.get("api/business/")
        .success(function(data){
            //console.log(data);
            $scope.business = data;

        })
        .error(function(){
            //$scope.category=[];
        });
        
    }
    if($stateParams.id === 'false'){
        vm.getBusinessCategory();
        
    }
    if($stateParams.id !== 'false'){
        $scope.editMode = true;
        vm.getBusinessCategory();
        $http.get("admin/client/"+$stateParams.id)
        .success(function(data){
            console.log(data);
            //$scope.business = data;
            angular.forEach(data, function (value, prop) {  
                if(typeof value == "object" && prop == "clients"){
                    $scope.client = value[0];
                    if($scope.client){
                        $scope.preval = $scope.client.name;
                    }

                }
            });

        })
        .error(function(){
        });
    }
    $scope.setDate = function(datestring) {
        return new Date(datestring);
    };
    //$scope.categories = [{'_id':'123','name':'bolly'}];
    console.log($scope.categories);
    //$scope.category = 'sdafsdfadsf';
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
        DTColumnBuilder.newColumn(null).withTitle('Views').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn(null).withTitle('Likes').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn(null).withTitle('Favorites').renderWith(function(){ return 0;}),
        DTColumnBuilder.newColumn('add_date').withTitle('Join Date').renderWith(function(data){
            var data = $scope.setDate(data);
            return data ? $filter('date')(data, 'dd-MM-yyyy') : '';
        }),
        DTColumnBuilder.newColumn('add_date').withTitle('Last Visit').renderWith(function(data){
            var data = $scope.setDate(data);
            return data ? $filter('date')(data, 'dd-MM-yyyy') : '';
        }),,
        //DTColumnBuilder.newColumn('image_url').withTitle('Image').renderWith(imageHtml),
       // DTColumnBuilder.newColumn('category').withTitle('Category').renderWith(categoryHtml),
       // DTColumnBuilder.newColumn('address').withTitle('Address').renderWith(addressHtml),
       // DTColumnBuilder.newColumn('phone').withTitle('Phone'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                var show = '';
                if(data.is_deleted == 1){
                    show = 'fa-check';
                } else {
                    show = 'fa-times';
                }
                return '<a class="btn btn-warning" style="margin-bottom:5px;"  ui-sref="dashboard.clientform({id: '+"'"+data._id+"'"+'})">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" style="margin-bottom:5px; width: 40px;"  ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>&nbsp;' +
                    '<button class="btn btn-info" style="margin-bottom:5px; width: 40px;"  ng-click="status('+"'"+data._id+"'"+')">' +
                    '   <i id="icon_'+data._id+'" class="fa '+show+'"></i>' +
                    '</button>';
            })
    ];
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
    $scope.edit = function(file) {

        if(file === undefined || file == null || file == ''){
        //console.log($scope.client.image_url);
              console.log($scope.client);
        $http.post("admin/updateClient", {client:$scope.client}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Client has been updated successfully!!")
                $state.go('dashboard.clients');
            }
        })
        .error(function(error){
            console.log(error);
        });
    } else {
        file.upload = Upload.upload({
          url: 'admin/addClient',
          data: {client: $scope.client, avtar: file},
        });

        file.upload.then(function (response) {
          $timeout(function () {
            file.result = response.data;
                if(file.result.status == 100){
                    alert("Client has been updated successfully!")
                    $state.go('dashboard.clients');
                }
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        }
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
        // Save category
    $scope.save = function(file=null){
        console.log($scope.client);
        file.upload = Upload.upload({
          url: 'admin/addClient',
          data: {client: $scope.client, avtar: file},
        });

        file.upload.then(function (response) {
          $timeout(function () {
            file.result = response.data;
                if(file.result.status == 100){
                    alert("Client has been created successfully!")
                    $state.go('dashboard.clients');
                }
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Client?");
        if(res){
            var res = confirm("Are you sure to delete,Client?")
            if(res){
                //Hit delete api
                $http.get("admin/deleteDocument/"+id+"/client")
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

    $scope.addClient = function() {
        $state.go('dashboard.clientform',{'id':false});
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.status = function(id) {
        var res = confirm("Do you want to Change Status,Client?");
        if(res){

            var myEl = angular.element( document.querySelector( '#icon_'+id ) );
            $http.get("admin/clientStatus/"+id)
            .success(function(data){
                console.log(data);
                if(data.status == 100){
                    if(myEl.hasClass('fa-check')){
                        myEl.addClass('fa-times');
                        myEl.removeClass('fa-check');
                    } else {
                        myEl.addClass('fa-check');
                        myEl.removeClass('fa-times');
                    }

                }

            //$state.go('dashboard.viewUser',{user:$scope.user});
            })
            .error(function(){
            });
        }
 

    };


            
});