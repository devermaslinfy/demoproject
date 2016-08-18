'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
.controller('MainCtrl',["$scope","$http", "$timeout", function($scope,$http,$timeout) {
        $scope.number = '';
        $scope.totalclient='';
        $scope.curr_selected = 4;
        var totalClientToday = 0;
        var totalClientWeek = 0;
        var totalClientMonth = 0;
        var totalUserToday = 0;
        var totalUserWeek = 0;
        var totalUserMonth = 0;
        var totalUserAll = 0;
        var totalClientAll = 0;
        $scope.goto='dashboard.users';
        $scope.goto_c="dashboard.clients";
        var getCount = function () {
            $http.get('admin/Count') // PASS THE DATA AS THE SECOND PARAMETER
                .success(
                    function(data){
                      console.log(data);
                        if(data.status == 100){
                          //console.log('fgjjjhgj')
                          $scope.number = data.count.user;
                          $scope.totalclient = data.count.client;
                          totalUserAll = data.count.user;
        				  totalClientAll = data.count.client;
                          var today = new Date();
                          var oneWeekAgo = new Date();
                          var month = today.getMonth();
						  var year = today.getYear();
						  var startDate = new Date(year,month-1,1);
						  var endDate = new Date(year,month,0);
						  startDate = startDate.setHours(0, 0, 0, 0);
						  endDate = endDate.setHours(0, 0, 0, 0);
                         // oneWeekAgo.setDate(today.getDate() - 7);
                          var to = new Date(oneWeekAgo.setTime(oneWeekAgo.getTime() - (oneWeekAgo.getDay() ? oneWeekAgo.getDay() : 7) * 24 * 60 * 60 * 1000));
                          var from = new Date(oneWeekAgo.setTime(oneWeekAgo.getTime() - (oneWeekAgo.getDay() ? oneWeekAgo.getDay() : 7) * 24 * 60 * 60 * 1000));
        				  to = to.setHours(0, 0, 0, 0);
        				  var from = new Date(oneWeekAgo.setTime(oneWeekAgo.getTime() - 6 * 24 * 60 * 60 * 1000));
                          from = from.setHours(0, 0, 0, 0);
                          today = today.setHours(0, 0, 0, 0);
                          data.count.clients.forEach(function(obj){
                          	var add_date = new Date(obj.add_date).setHours(0, 0, 0, 0);
                          	//console.log('add_date:'+add_date);
                          	if(add_date == today){
                          		totalClientToday++;
                          	}
                          	if(add_date >= from && add_date <= to ){
                          		totalClientWeek++
                          	}
                          	if(add_date >= startDate && add_date <= endDate ){
                          		totalClientMonth++
                          	}
                          	
                          });
                        data.count.users.forEach(function(obj){
                          	var add_date = new Date(obj.add_date).setHours(0, 0, 0, 0);
                          	//console.log('add_date:'+add_date);
                          	if(add_date == today){
                          		totalUserToday = totalUserToday + 1;
                          	}
                          	if(add_date >= from && add_date <= to ){
                          		totalUserWeek = totalUserWeek + 1;
                          	}
                          	if(add_date >= startDate && add_date <= endDate ){
                          		totalUserMonth = totalUserMonth + 1;
                          	}
                          	
                          });
                          //console.log('to:'+to+' from:' + from + 'startDate:'+startDate+' endDate:'+endDate+' today:'+today );
                          //console.log(totalUserWeek + ' today ' + totalUserToday + 'month:' +totalUserMonth);
                        }
                    })
                .error(
                    function(error){
                        console.log(error)
                    });
        }
        getCount();
       $scope.getUserCount = function(filter){
       		if(filter == 1){
       			$scope.number = totalUserToday;
        		$scope.totalclient = totalClientToday;
        		$scope.selected =1;
       		} else if(filter == 2){
       			$scope.number = totalUserWeek;
        		$scope.totalclient = totalClientWeek;
        		$scope.selected =2;
       		} else if(filter == 3){
       			$scope.number = totalUserMonth;
        		$scope.totalclient = totalClientMonth;
        		$scope.selected = 3;
       		}else {
				$scope.number = totalUserAll;
        		$scope.totalclient = totalClientAll;
        		$scope.selected = 4;
       		}
       }
	   $scope.getUserData = function(filter) {
		  if(filter == 1){
			 var labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
			 var data   = [ todayDataUsers() ];
			 var series = ['Users per Hour'];
		  }else if(filter == 2){
			 var labels = weekDays();
			 var data   = [ weekDaysdataUsers() ];
			 var series = ['Users per Day'];
		  }else if(filter == 3){
			 var labels = monthDays();
			 var data   = [ monthDaysDataUsers() ];
			 var series = ['Users per Day ('+monthName()+')'];
		  }else{
			 var labels = getYear();
			 var data   = [ getYearDataUsers() ];
			 var series = ['Users per Year'];
		  }
           
		$scope.line = {
	    labels: labels,
	    series: series,
	    data: data,
	    onClick: function (points, evt) {
	      //console.log(points, evt);
	    }
    }
	};
	
	$scope.getClientData = function(filter) {
		  if(filter == 1){
			 var labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
			 var data   = [ todayDataClients() ];
			 var series = ['Clients per Hour'];
		  }else if(filter == 2){
			 var labels = weekDays();
			 var data   = [ weekDaysdataClients() ];
			 var series  = ['Clients per Day'];
		  }else if(filter == 3){
			 var labels = monthDays();
			 var data   = [ monthDaysDataClients() ];
			 var series = ['Clients per Day ('+monthName()+')'];
		  }else{
			 var labels = getYear();
			 var data  = [ getYearDataClients() ];
			 var series = ['Clients per Year'];
		  }
           
		$scope.line = {
	    labels: labels,
	    series: series,
	    data: data,
	    onClick: function (points, evt) {
	      //console.log(points, evt);
	    }
    }
	};
	
	/*=========== Code for chart Label ============*/
	
	// get the last weeks days for label
	
	function weekDays(){
		var arr = [];
		var curr = new Date; // get current date
		var first = curr.getDate();
		var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		for(var i = 0;i<7;i++){
		   var next = new Date(curr.getTime());
		   next.setDate(first-i);
		   var day =  days[next.getDay().toString()];
		   arr.push(day);
		}
		return arr.reverse();
	}
	
	// get the last month days for label
	
	function monthDays(){
		var makeDate = new Date;
		makeDate = new Date(makeDate.setMonth(makeDate.getMonth()-1));
		var month = makeDate.getMonth();
		var year = makeDate.getFullYear();
		var date = new Date(year, month, 1);
		var days = [];
		while (date.getMonth() === month) {
			days.push((new Date(date)).getDate());
			date.setDate(date.getDate() + 1);
		}
		return days;
	}
	
	function monthName(){
		  var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
		  var makeDate = new Date;
		  makeDate = new Date(makeDate.setMonth(makeDate.getMonth()-1));
		  var month = makeDate.getMonth();
		  return monthNames[month];

 }
	//get years for label
	
	function getYear(){
		var makeDate = new Date;
		var year = makeDate.getFullYear();
		var years = [];
		for(var y=2016; y <= year; y++){
			years.push(y);
		}
		console.log(years);
		return years;
	}
	
	function daydiff(first, second) {
		return Math.round((second-first)/(1000*60*60*24));
	}
	
	/*=========== Code for User chart ============*/
	
	//Get weeks days data for User Chart
	
	function weekDaysdataUsers(){
		var arr = [];
		var curr = new Date; // get current date
		var first = curr.getDate();
				$http.get("api/users")
                .success(function(data){
					 for(var i = 0;i<7;i++){
				     var next = new Date(curr.getTime());
				     next.setDate(first-i);
					 var count = 0;
				     data.forEach(function(user){
						 if(Math.abs(daydiff(next, new Date(user.add_date))) == 0){
							 ++count;
						 }
						});
						 arr.push(count);
					}
					arr.reverse();
                })
              .error(function(){
                });
		
		return arr;
	}

	//Get Last Month days data for User Chart
	
	function monthDaysDataUsers(){
		var makeDate = new Date;
		makeDate = new Date(makeDate.setMonth(makeDate.getMonth()-1));
		var month = makeDate.getMonth();
		var year = makeDate.getFullYear();
		var date = new Date(year, month, 1);
		var arr = [];
			$http.get("api/users")
			.success(function(data){
				while (date.getMonth() === month) {
				var next = new Date(date);
				 var count = 0;
				 data.forEach(function(user){
					 if(Math.abs(daydiff(next, new Date(user.add_date))) == 0){
						 ++count;
					 }
					});
					arr.push(count);
					date.setDate(date.getDate() + 1);
				}
			})
		  .error(function(){
			});
		return arr;
	}
	
	//Get Today data for User Chart
	
	function todayDataUsers(){
		var arr = [];
		$http.get("admin/chartUsersToday")
			.success(function(data){
				for(var h=0; h<24;h++){
					var count = 0;
					var d = new Date();
					d.setHours(h,0,0,0);
					var dd = new Date();
					dd.setHours(h+1,0,0,0);
					if(data.length){
					data.forEach(function(user){
					 if( d <= new Date(user.add_date) && dd > new Date(user.add_date)){
						 ++count;
					 }
					});
					}
					arr.push(count);
				}
			})
			.error(function(){
			});
		console.log(arr);
		return arr;
	}
	
	//Get Yearly data for User Chart
	
	function getYearDataUsers(){
		var makeDate = new Date;
		var currentYear = makeDate.getFullYear();
		var arr = [];
			$http.get("api/users")
			.success(function(data){
				for(var y=2016; y <= currentYear; y++){
				var count = 0;
				 data.forEach(function(user){
					var next = new Date(user.add_date);
					var year = next.getFullYear();
					 if(y === year){
						 ++count;
					 }
					});
					arr.push(count);
				}
			})
		  .error(function(){
			});
		return arr;
	}
	
	
	/*=========== Code for client chart ============*/
	
	//Get weeks days data for Client Chart
	
	function weekDaysdataClients(){
		var arr = [];
		var curr = new Date; // get current date
		var first = curr.getDate();
				$http.get("api/clients")
                .success(function(data){
					 for(var i = 0;i<7;i++){
				     var next = new Date(curr.getTime());
				     next.setDate(first-i);
					 var count = 0;
				     data.forEach(function(user){
						 if(Math.abs(daydiff(next, new Date(user.add_date))) == 0){
							 ++count;
						 }
						});
						 arr.push(count);
					}
					arr.reverse();
                })
              .error(function(){
                });
		
		return arr;
	}

	//Get Last Month days data for Client Chart
	
	function monthDaysDataClients(){
		var makeDate = new Date;
		makeDate = new Date(makeDate.setMonth(makeDate.getMonth()-1));
		var month = makeDate.getMonth();
		var year = makeDate.getFullYear();
		var date = new Date(year, month, 1);
		var arr = [];
			$http.get("api/clients")
			.success(function(data){
				while (date.getMonth() === month) {
				var next = new Date(date);
				 var count = 0;
				 data.forEach(function(user){
					 if(Math.abs(daydiff(next, new Date(user.add_date))) == 0){
						 ++count;
					 }
					});
					arr.push(count);
					date.setDate(date.getDate() + 1);
				}
			})
		  .error(function(){
			});
		return arr;
	}
	
	//Get Today data for Client Chart
	
	function todayDataClients(){
		var arr = [];
		$http.get("admin/chartClientsToday")
			.success(function(data){
				for(var h=0; h<24;h++){
					var count = 0;
					var d = new Date();
					d.setHours(h,0,0,0);
					var dd = new Date();
					dd.setHours(h+1,0,0,0);
					data.forEach(function(user){
					 if( d <= new Date(user.add_date) && dd > new Date(user.add_date)){
						 ++count;
					 }
					});
					arr.push(count);
				}
			})
			.error(function(){
			});
		console.log(arr);
		return arr;
	}
	
	//Get Yearly data for Client Chart
	
	function getYearDataClients(){
		var makeDate = new Date;
		var currentYear = makeDate.getFullYear();
		var arr = [];
			$http.get("api/clients")
			.success(function(data){
				for(var y=2016; y <= currentYear; y++){
				var count = 0;
				 data.forEach(function(user){
					var next = new Date(user.add_date);
					var year = next.getFullYear();
					 if(y === year){
						 ++count;
					 }
					});
					arr.push(count);
				}
			})
		  .error(function(){
			});
		return arr;
	}
	
	   
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
            //console.log(data);
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