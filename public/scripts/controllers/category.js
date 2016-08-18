'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('CategoryCtrl', function ( Upload,$timeout,DTOptionsBuilder,DTColumnBuilder,$compile,$sessionStorage,$scope,$resource,$state,$stateParams,$injector,$filter,$rootScope) {


    var vm = this;
    var $http = $injector.get('$http');
    $scope.category = {};
    $scope.editModeCat = '';
    $scope.showEditMode = '';
    $scope.imageShow = true;
    $scope.preval = '';
    if($stateParams.editModeCat === false | $stateParams.editModeCat === true){
         //localStorage.removeItem("user");
         console.log($stateParams.editModeCat);
         $sessionStorage.editModeCat = $stateParams.editModeCat;
         //$scope.editModeCat = $stateParams.editModeCat;
    } else{
        $sessionStorage.editModeCat = $sessionStorage.editModeCat;
        //$scope.editModeCat = $sessionStorage.editModeCat;
    }

    var editModeCat = $sessionStorage.editModeCat;
    if (editModeCat === false ){

        $scope.editModeCat = false;
    } else {

        $scope.editModeCat = true;
    }
    if($stateParams.category){
        $scope.category = $stateParams.category;
        $scope.preval = $scope.category.name;
        localStorage.setItem("category", JSON.stringify($stateParams.category));
        //console.log(localStorage.getItem("user"));
     } else if(!$stateParams.editModeCat && $scope.editModeCat == true) {
        $scope.category = JSON.parse(localStorage.getItem("category"));
        if($scope.category){
            $scope.preval = $scope.category.name;
        }
     }
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
        DTColumnBuilder.newColumn('name').withTitle('Name').renderWith(function(data){
            if(data.length > 30){
                return data.substring(0, 30)+'...';
            }else{
                return data;
            }
        }),
        DTColumnBuilder.newColumn('image_url').withTitle('Image').renderWith(imageHtml),
        DTColumnBuilder.newColumn(null).withTitle('Number of Clients').renderWith(clientsHtml),
        DTColumnBuilder.newColumn('add_date').withTitle('Add_Date').renderWith(function(data){
            return data ? $filter('date')(data, 'dd-MM-yyyy') : '';
        }),
        DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(statusHtml),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                var show = '';
                if(data.show == 1){
                    show = 'fa-check';
                } else {
                    show = 'fa-times';
                }
                return '<a style="margin-bottom:5px;" class="btn btn-warning" ui-sref="dashboard.catform({index: '+"'"+data._id+"'"+'})" ng-click="edit('+"'"+data._id+"'"+',editModeCat = true)">' +
                    '   <i class="fa fa-edit"></i>' +
                    '</a>&nbsp;' +
                    '<button style="margin-bottom:5px; width: 40px;" class="btn btn-danger" ng-click="delete('+"'"+data._id+"'"+')">' +
                    '   <i class="fa fa-trash-o"></i>' +
                    '</button>&nbsp;' +
                     '<button style="margin-bottom:5px; width: 40px;" class="btn btn-info" ng-click="status('+"'"+data._id+"'"+')">' +
                    '   <i id="icon_'+data._id+'" class="fa '+ show +'"></i>' +
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
    function clientsHtml(data, type, full, meta){
    	//console.log(data);
    	//data = JSON.parse(data);
    	return  Object.keys(data).length;
    }
    function imageHtml(data, type, full, meta) {
    	//console.log(data);
        return '<img src="images/category/'+data+'">';
	}
	function statusHtml(data, type, full, meta) {
		if (data == 1) {
			return 'Active';
		} else if(data == 2) {
			return 'Deactive';
		} else {
            return 'Deactive';
        }
	}
    $scope.edit = function(id,editModeCat) {
        if(editModeCat === false | editModeCat === true){
             $sessionStorage.editModeCat = editModeCat;
        } else{
            $sessionStorage.editModeCat = $sessionStorage.editModeCat;
        }
        console.log('Editing ' + editModeCat);
        $http.get("admin/category/"+id)
        .success(function(data){
            console.log(data);
        angular.forEach(data, function (value, prop) {  
            if(typeof value == "object" && prop == "category"){
                 $scope.category = value[0];
            }
        });
        console.log($scope.category.name);
/*        $scope.user.add_date = $scope.setDate($scope.user.add_date);
        $scope.user.last_login = $scope.user.last_login ? $scope.setDate($scope.user.last_login):'';
        if($scope.user.login_type == 1){
            console.log($scope.user.login_type);
            $scope.social = true;
        }
        console.log($scope.user.add_date);*/
        $state.go('dashboard.catform',{category:$scope.category});
        })
        .error(function(){
        });
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.delete = function(id) {
        console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Category?");
        if(res){
            var res = confirm("Are you sure to delete,Category?")
            if(res){
                //var type='';
                //vm.reloadData();
                $scope.deleteId = id;
                
                console.log('Deleting' + id );
                //var data = { id : id};
                $http.get("admin/deleteCategory/"+id)
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
    $scope.addCategory = function() {
        $state.go('dashboard.catform',{'editModeCat':false});
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
    $scope.status = function(id) {
        var res = confirm("Do you want to Change Status,Category?");
        if(res){

            var myEl = angular.element( document.querySelector( '#icon_'+id ) );
            $http.get("admin/statusCategory/"+id)
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
/*    $scope.submit = function () {
        $scope.editModeCat ? $scope.updateCategory() : $scope.save();
    }*/
    // Save category
    $scope.save = function(file=null){
        file.upload = Upload.upload({
          url: 'admin/addCategory',
          data: {category: $scope.category, avtar: file},
        });

        file.upload.then(function (response) {
          $timeout(function () {
            file.result = response.data;
                if(file.result.status == 100){
                    alert("Category has been added successfully!")
                    $state.go('dashboard.categories');
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

    // update category
/*    $scope.updateCategory = function(){
        console.log($scope.category);

        var fd = new FormData();
        fd.append('avtar', $scope.avtar);
        console.log($scope.avtar);
        fd.append('category', angular.toJson($scope.category));
        $http.post("admin/updateCategory", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Category has been added successfully!")
                $state.go('dashboard.categories');
            }
        })
        .error(function(error){
            console.log(error);
        });
    }*/
    $scope.updateCategory = function(file) {
    if(file === undefined || file == null || file == ''){
        //console.log($scope.category.image_url);
        $http.post("admin/updateCategory", {category:$scope.category}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Category has been updated successfully!")
                $state.go('dashboard.categories');
            }
        })
        .error(function(error){
            console.log(error);
        });
    } else {
        file.upload = Upload.upload({
          url: 'admin/updateCategory',
          data: {category: $scope.category, avtar: file},
        });

        file.upload.then(function (response) {
          $timeout(function () {
            file.result = response.data;
                if(file.result.status == 100){
                    alert("Category has been updated successfully!")
                    $state.go('dashboard.categories');
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

            
})
.controller('QuestionCtrl', function ( DTOptionsBuilder,DTColumnBuilder,$compile,$scope,$resource,$state,$injector,$stateParams) {


    var vm = this;
    vm.localPromise = localPromise;
    var $http = $injector.get('$http');
    var q = $injector.get('$q');
    $scope.maxlength = 1024;
    $scope.editModeCat = false;
    $scope.question = {};
    if($stateParams.id){
        $scope.editModeCat = true;
        //$state.go('dashboard.businessform');
        //console.log('business id' + $stateParams.id);
        $http.get("admin/question/"+$stateParams.id)
        .success(function(data){
            //console.log(data);
            $scope.business = data;
            angular.forEach(data, function (value, prop) {  
                if(typeof value == "object" && prop == "question"){
                    $scope.question = value[0];
                    //$scope.question.answer = $scope.question.answer[0];
                    //console.log($scope.question.answer);
                    //var index=1;
/*                    var answer = {};
                    angular.forEach($scope.question.answer, function (value, prop) {  
                        //var option = 'option'+index;
                        answer[prop] = value;
                        //index = index+1;
                    });
                    $scope.question.answer = answer;*/
                    // $scope.preval = $scope.business.name;
                }
            });

        })
        .error(function(){
        });
    }
    vm.users;
    function localPromise() {
            var dfd = q.defer();

            var remotePromise = $resource('admin/questions').query().$promise;
            remotePromise.then(function (data) {
                vm.users = data[1].users;
                //console.log('quest'+data[0])
                dfd.resolve(data[0].question);
            });

            return dfd.promise;
    }
    $http.get("api/questions")
        .success(function(res){
            //console.log(res);
        })
        .error(function(error){
            console.log(error);
    });
    var option1 = 0;
    var option2 = 0;
    var option3 = 0;
    var option4 = 0;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(/*function() {
            return $resource('api/questions').query().$promise;
        }*/vm.localPromise)
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
        DTColumnBuilder.newColumn('question').withTitle('Option A').renderWith(function(data, type, full, meta){ 
            //console.log(vm.users);
            var users = vm.users
            var question='';
            Object.keys(full).forEach(function(key){
                if(key == '_id'){
                    question = full[key];
                }
                if(key == 'answer'){
                    var answer = full[key];
                    //console.log(answer);
                    var newUsers = users.reduce(function(newArray, user){

                        Object.keys(user).forEach(function(key){
                            if(key == 'questions'){
                                user[key].forEach(function(ques){
                                    if(question == ques){
                                        newArray.push(user)
                                    }
                                })
                            }
                        })

                        return newArray; /* This is important! */
                    }, []);
                    Object.keys(answer).forEach(function(key){

                        var option_ans = answer[key];

                        if(key == 'option1'){
                            newUsers.forEach(function(user){

                                Object.keys(user).forEach(function(key){
                                    if(key == 'answer'){
                                        user[key].forEach(function(ans){
                                            if(question == ans.question_id){
                                                console.log(ans.question_id+": "+ ans.answer);
                                                if(option_ans == ans.answer){
                                                    option1 = option1+1;
                                                    return false;
                                                }
                                                
                                            }
                                        })
                                        return false;
                                    }
                                })
                                //console.log('answer'+user['answer']);
                            });

                        } else if(key == 'option2'){
                            newUsers.forEach(function(user){

                                Object.keys(user).forEach(function(key){
                                    if(key == 'answer'){
                                        user[key].forEach(function(ans){
                                            if(question == ans.question_id){
                                                console.log(ans.question_id+": "+ ans.answer);
                                                if(option_ans == ans.answer){
                                                    option2 = option2+1;
                                                    return false;
                                                }
                                                
                                            }
                                        })
                                        return false;
                                    }
                                })
                                //console.log('answer'+user['answer']);
                            });

                        } else if(key == 'option3'){
                            newUsers.forEach(function(user){

                                Object.keys(user).forEach(function(key){
                                    if(key == 'answer'){
                                        user[key].forEach(function(ans){
                                            if(question == ans.question_id){
                                                console.log(ans.question_id+": "+ ans.answer);
                                                if(option_ans == ans.answer){
                                                    option3 = option3+1;
                                                    return false;
                                                }
                                                
                                            }
                                        })
                                        return false;
                                    }
                                })

                            });

                        } else if(key == 'option4'){
                            newUsers.forEach(function(user){

                                Object.keys(user).forEach(function(key){
                                    if(key == 'answer'){
                                        user[key].forEach(function(ans){
                                            if(question == ans.question_id){
                                                console.log(ans.question_id+": "+ ans.answer);
                                                if(option_ans == ans.answer){
                                                    option4 = option4+1;
                                                    return false;
                                                }
                                                
                                            }
                                        })
                                        return false;
                                    }
                                })

                            });
                        }


                    });
                }

            });
            return option1;
        }),
        DTColumnBuilder.newColumn(null).withTitle('Option B').renderWith(function(){ return option2;}),
        DTColumnBuilder.newColumn(null).withTitle('Option C').renderWith(function(){ return option3;}),
        DTColumnBuilder.newColumn(null).withTitle('Option D').renderWith(function(){ return option4;}),
        //DTColumnBuilder.newColumn('answer').withTitle('Answer').renderWith(answerHtml),
        //DTColumnBuilder.newColumn('add_date').withTitle('Add_Date'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                return '<a class="btn btn-warning" ui-sref="dashboard.questform({id: '+"'"+data._id+"'"+'})">' +
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
    $scope.edit = function() {
        //console.log($scope.question)
/*        console.log($scope.question);
        var answer = [];
        angular.forEach($scope.question.answer, function (value, prop) {  
            answer.push(value);
        });
        $scope.question.finalanswer = answer;*/
        $http.post("admin/updateQuestion", {data:$scope.question}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Question has been updated successfully!")
                $state.go('dashboard.questions');
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
        //console.log('Deleting' + id);
        var res = confirm("Do you want to delete,Question?");
        if(res){
            var res = confirm("Are you sure to delete,Question?")
            if(res){
                //var type='';
                //vm.reloadData();
                $scope.deleteId = id;
                
                console.log('Deleting' + id );
                //var data = { id : id};
                $http.get("admin/deleteQuestion/"+id)
                .success(function(data){
                    console.log(data);
                    if(data.status == 100){
                        alert("Question has been deleted successfully!");
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

    $scope.addQuestion = function() {
        $state.go('dashboard.questform');
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        //vm.dtInstance.reloadData();
    };
        // Save question
    $scope.save = function(){
/*        console.log($scope.question);
        var answer = [];
        angular.forEach($scope.question.answer, function (value, prop) {  
            answer.push(value);
        });
        $scope.question.finalanswer = answer;*/
      $http.post("admin/addQuestion", {data:$scope.question}, {
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(res){
            if(res.status == 100){
                alert("Question has been added successfully!")
                $state.go('dashboard.questions');
            }
        })
        .error(function(error){
            console.log(error);
        });
    }

            
});