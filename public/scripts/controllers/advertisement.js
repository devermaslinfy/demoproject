'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('AdvertisementCtrl', function (Upload,$timeout,DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state,$injector,$stateParams,$sessionStorage) {

    var $http = $injector.get('$http');
    var vm = this;

    $scope.advertisement = {};
    //$scope.advertisement.category =[]; 
    $scope.editModeAdv = '';
    $scope.editMode = '';
    $scope.preval = '';
    $scope.advertisement.category=[];
    //$scope.example1model = [];
    vm.getCategory = function(){
        $http.get("api/categories/")
        .success(function(data){
/*        var newNumbers = data.reduce(function(newArray, data){
            data.filter(function (el) {
                newArray.push({"_id":el._id,"name":el._name});
            });
        });*/
            var newArray=[];
            _.filter (data, function(el) {
                newArray.push({"_id":el._id,"name":el.name });
            });
            $scope.categories = newArray;
            //console.log(newArray);

        })
        .error(function(){
            //$scope.category=[];
        });  
    }
    if($stateParams.id === 'false'){
        vm.getCategory();
    }
    if($stateParams.id !== 'false' && $stateParams.id !==undefined){
        $scope.editMode = true;
        vm.getCategory();
        $http.get("admin/advertisement/"+$stateParams.id)
        .success(function(data){
            //console.log(data);
            $scope.business = data;
            var newArray=[];
            angular.forEach(data, function (value, prop) {  
                if(typeof value == "object" && prop == "advertisement"){
                    $scope.advertisement = value[0];
                    $scope.preval = $scope.advertisement.name;
                    var allCat = $scope.categories;
                    var seletedCat = $scope.advertisement.category;
                    _.filter (allCat, function(el) {
                        if(seletedCat.indexOf(el._id) !== -1){
                           newArray.push({"_id":el._id,"name":el.name });
                        }

                    });
                }
            });
            $scope.example1model = newArray;
            $scope.$applyAsync();
            //$scope.$apply();
            console.log($scope.example1model);

        })
        .error(function(){
        });
    }

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/advertisements').query().$promise;
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
        DTColumnBuilder.newColumn('category').withTitle('Related').renderWith(categoryHtml),
        DTColumnBuilder.newColumn('photo').withTitle('Banner Preview').renderWith(imageHtml),
        DTColumnBuilder.newColumn('hit').withTitle('Number of View').renderWith(function(data){
            return data ? data : 0;
        }),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
        .renderWith(function(data, type, full, meta) {
                return '<a class="btn btn-warning" ui-sref="dashboard.advertform({id: '+"'"+data._id+"'"+'})" >' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
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

    function categoryHtml(data, type, full, meta) {
        //data = angular.fromJson(data);
        var category = '<ol type="1">';
        for (var key in data) {

            category += '<li>'+data[key].name+'</li>';

        }
        category += '</ol>';
                            
        return category;
        //return data;
     }

    function imageHtml(data, type, full, meta) {
        //console.log(data);
        return '<img src="images/advertisement/'+data+'">';
    }
    function statusHtml(data, type, full, meta) {
        if (data == 1) {
            return 'Active';
        } else {
            return 'Deactive';
        }
    }
    // Save advertisement
    $scope.save = function(file){
        var newCategory = [];
        var modifyCategory = [];
        newCategory = $scope.example1model;
        if(newCategory !== undefined || newCategory != null || newCategory != ''){
            newCategory.forEach(function(obj){
                if(obj !== null){
                    modifyCategory.push(obj._id);
                }
            })
            //$scope.advertisement.category = '';
            $scope.advertisement.category = modifyCategory;
        }
        file.upload = Upload.upload({
          url: 'admin/addAdvertisement',
          data: {advertisement: $scope.advertisement, avtar: file},
        });

        file.upload.then(function (response) {
          $timeout(function () {
            file.result = response.data;
                if(file.result.status == 100){
                    alert("Advertisement has been added successfully!")
                    $state.go('dashboard.advertisements');
                }
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
            $scope.example1model = newCategory;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }
    $scope.edit = function(file=null) {
        var newCategory = [];
        var modifyCategory = [];
        newCategory = $scope.example1model;
        if(newCategory !== undefined || newCategory != null || newCategory != ''){
            newCategory.forEach(function(obj){
                if(obj !== null){
                    modifyCategory.push(obj._id);
                }

            })
            $scope.advertisement.category = modifyCategory;
        }

        if(file === undefined || file == null || file == ''){
            $http.post("admin/updateAdvertisement", {advertisement: $scope.advertisement}, {
                headers: {'Content-Type': 'application/json'}
            })
            .success(function(res){
                if(res.status == 100){
                    alert("Advertisement has been updated successfully!")
                    $state.go('dashboard.advertisements');
                }
            })
            .error(function(error){
                console.log(error);
                $scope.example1model = newCategory;
            });
        } else {
            file.upload = Upload.upload({
              url: 'admin/updateAdvertisement',
              data: {advertisement: $scope.advertisement, avtar: file},
            });

            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
                    if(file.result.status == 100){
                        alert("Advertisement has been updated successfully!")
                        $state.go('dashboard.advertisements');
                    }
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
                $scope.example1model = newCategory;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Advertisement?");
        if(res){
            confirm("Are you sure to delete,Advertisement?");
            if(res){
                //var type='';
                //vm.reloadData();
                $scope.deleteId = id;
                
                console.log('Deleting' + id );
                //var data = { id : id};
                $http.get("admin/deleteAdvertisement/"+id)
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

    $scope.addAdvertisement = function() {
        $state.go('dashboard.advertform',{'id':false});
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

            
})
.controller('BusinessCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state,$injector,$stateParams) {

    var $http = $injector.get('$http');
    var vm = this;
    $scope.id = '';
    $scope.preval = '';
    $scope.business ={};
    if($stateParams.id){
        //$state.go('dashboard.businessform');
        console.log('business id' + $stateParams.id);
        $http.get("admin/business/"+$stateParams.id)
        .success(function(data){
            //console.log(data);
            $scope.business = data;
        angular.forEach(data, function (value, prop) {  
            if(typeof value == "object" && prop == "business"){
                 $scope.business = value[0];
                 $scope.preval = $scope.business.name;
            }
            //console.log(value);
        });

        })
        .error(function(){
        });
    }
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/business').query().$promise;
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
        DTColumnBuilder.newColumn(null).withTitle('# Number').renderWith(renderRetreadNo),
        DTColumnBuilder.newColumn('name').withTitle('Type Name'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
        .renderWith(function(data, type, full, meta) {
                return '<a class="btn btn-warning" ui-sref="dashboard.editBusiness({id: '+"'"+data._id+"'"+'})">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
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
    function renderRetreadNo(data, type, full, meta) {
        // meta.row => index of the row
        // meta.col => index of the column
        return meta.row + 1;
    }

    $scope.edit = function() {
        //console.log('Editing ' + id);
        $http.post("admin/updateBusiness", {data:$scope.business}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Business Type has been updated successfully!")
                $state.go('dashboard.business');
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
        console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Business Type?");
        if(res){
            var res = confirm("Are you sure to delete,Business Type?")
            if(res){
                //var type='';
                //vm.reloadData();
                $scope.deleteId = id;
                
                console.log('Deleting' + id );
                //var data = { id : id};
                $http.get("admin/deleteBusiness/"+id)
                .success(function(data){
                    console.log(data);
                    if(data.status == 100){
                        alert("Business Type has been deleted successfully!");
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
    $scope.addBusiness = function() {
        $state.go('dashboard.businessform');
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
    $scope.save = function(){
        $http.post("admin/addBusiness", {data:$scope.business}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Business Type has been added successfully!")
                $state.go('dashboard.business');
            }
        })
        .error(function(error){
            console.log(error);
        });
    }

            
});