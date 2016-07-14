'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('MainCtrl',["$scope", function($scope) {
        $scope.bar = {
        labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
        series: ['Series A', 'Series B'],

        data: [
           [65, 59, 80, 81, 56, 55, 40],
           [28, 48, 40, 19, 86, 27, 90]
        ]
        
    };
  }])
.controller('AdminCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state) {


    var vm = this;

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/admins').query().$promise;
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
        DTColumnBuilder.newColumn('last_login').withTitle('Last Login'),
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
    $scope.edit = function(id) {
        console.log('Editing ' + id);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        confirm("Do you want to delete,Admin?");
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.dtInstance = {};
    vm.dtIntanceCallback = function (instance) {
        vm.dtInstance = instance;
    }

    $scope.addAdmin = function() {
        $state.go('dashboard.adminform');
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };

            
})