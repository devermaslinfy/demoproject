'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('CategoryCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state) {


    var vm = this;

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/categories').query().$promise;
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
        DTColumnBuilder.newColumn('image_url').withTitle('Image').renderWith(imageHtml),
        DTColumnBuilder.newColumn(null).withTitle('Number of Clients').renderWith(clientsHtml),
        DTColumnBuilder.newColumn('add_date').withTitle('Add_Date'),
        DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(statusHtml),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                return '<a class="btn btn-warning" ui-sref="dashboard.catform({index: '+"'"+data._id+"'"+'})" ng-click="edit('+"'"+data._id+"'"+')">' +
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
    function clientsHtml(data, type, full, meta){
    	console.log(data);
    	//data = JSON.parse(data);
    	return  Object.keys(data).length;
    }
    function imageHtml(data, type, full, meta) {
    	//console.log(data);
        return '<img src="'+data+'">';
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

    $scope.addCategory = function() {
        $state.go('dashboard.catform');
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
.controller('QuestionCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state) {


    var vm = this;

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('api/questions').query().$promise;
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
        DTColumnBuilder.newColumn('question').withTitle('Question'),
        DTColumnBuilder.newColumn(null).withTitle('Option A').renderWith(function(){ return 1;}),
        DTColumnBuilder.newColumn(null).withTitle('Option B').renderWith(function(){ return 2;}),
        DTColumnBuilder.newColumn(null).withTitle('Option C').renderWith(function(){ return 3;}),
        DTColumnBuilder.newColumn(null).withTitle('Option D').renderWith(function(){ return 4;}),
        //DTColumnBuilder.newColumn('answer').withTitle('Answer').renderWith(answerHtml),
        //DTColumnBuilder.newColumn('add_date').withTitle('Add_Date'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                return '<a class="btn btn-warning" ui-sref="dashboard.questform({index: '+"'"+data._id+"'"+'})" ng-click="edit('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>';
            })
    ];
    function answerHtml(data, type, full, meta) {
    	console.log(data);
    	var answer = '<ol type="A">';
    	for (var key in data) {
		  if (data.hasOwnProperty(key)) {
		    var val = data[key];
		    answer += '<li>'+val+'</li>';
		    console.log(val);
		  }
		}
		answer += '</ol>';
                            
        return answer;
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
        confirm("Do you want to delete,Question?");
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    vm.dtInstance = {};
    vm.dtIntanceCallback = function (instance) {
        vm.dtInstance = instance;
    }

    $scope.addQuestion = function() {
        $state.go('dashboard.questform');
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };

            
});