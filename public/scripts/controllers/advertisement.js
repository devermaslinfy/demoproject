'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('AdvertisementCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state) {


    var vm = this;

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
        DTColumnBuilder.newColumn('hit').withTitle('Number of View'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
        .renderWith(function(data, type, full, meta) {
                return '<a class="btn btn-warning" ui-sref="dashboard.advertform({index: '+"'"+data._id+"'"+'})" ng-click="edit('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>';
            })
    ];
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
    $scope.edit = function(id) {
        console.log('Editing ' + id);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Category?");
        if(res){
        	confirm("Are you sure to delete,Category?")
        }
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.dtInstance = {};
    vm.dtIntanceCallback = function (instance) {
        vm.dtInstance = instance;
    }

    $scope.addAdvertisement = function() {
        $state.go('dashboard.advertform');
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
.controller('BusinessCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state) {


    var vm = this;

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
                return '<a class="btn btn-warning" ui-sref="dashboard.advertform({index: '+"'"+data._id+"'"+'})" ng-click="edit('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>';
            })
    ];
    function renderRetreadNo(data, type, full, meta) {
        // meta.row => index of the row
        // meta.col => index of the column
        return meta.row + 1;
    }

    $scope.edit = function(id) {
        console.log('Editing ' + id);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Category?");
        if(res){
            confirm("Are you sure to delete,Category?")
        }
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.dtInstance = {};
    vm.dtIntanceCallback = function (instance) {
        vm.dtInstance = instance;
    }

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

            
});