'use strict';

/**
 * @ngdoc directive
 * @name Validation.directive:cu-email
 * @description
 * # cu-email
 */
angular.module('sbAdminApp')
.directive('cuemail', function($q, $timeout,$http) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var usernames = ['Jim', 'John', 'Jill', 'Jackie'];
      var emailType = attrs.emailType;
      var url = '';
      //console.log(emailType);
      if(emailType == 'user'){
        url = 'admin/userCheckEmail';
      } else if(emailType == 'admin'){
        url = 'admin/adminCheckEmail';
      }else if(emailType == 'editadmin'){
        url = 'admin/checkEmailEdit';
      }else if(emailType == 'forgotpass'){
        url = 'admin/checkEmailForgot';
      }else {
        url = 'admin/checkEmail';
      }
      ctrl.$asyncValidators.cuemail = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

/*        $timeout(function() {
          // Mock a delayed response
          if (usernames.indexOf(modelValue) === -1) {
            // The username is available
            def.resolve();
          } else {
            def.reject();
          }

        }, 2000);*/
         //console.log(modelValue);
         var preval = attrs.preval;
        var data = {email: modelValue,value:preval};
        $http.get(url,{params:data})
          .then(function(response) {
            if(response.data.status == 100) {
              def.resolve();
            } else {
              def.reject();
            }
            //console.log(response)
          }, function(err) {
            def.reject();
          });

        return def.promise;
      };
    }
  };
})
.directive('cuemailup', function($q, $timeout,$http,$rootScope) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var usernames = ['Jim', 'John', 'Jill', 'Jackie'];
      var emailType = attrs.emailType;
      var url = '';
      if(emailType == 'user'){
        url = 'admin/userCheckEmailUpdate';
      }else {
        url = 'admin/checkEmail';
      }
      ctrl.$asyncValidators.cuemailup = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

/*        $timeout(function() {
          // Mock a delayed response
          if (usernames.indexOf(modelValue) === -1) {
            // The username is available
            def.resolve();
          } else {
            def.reject();
          }

        }, 2000);*/
         //console.log($rootScope.email);
         if($rootScope.email){
          var preemail = $rootScope.email;
         } else {
          var preemail = '';
         }
        var data = {email: modelValue,value:preemail};
        $http.get(url,{params:data})
          .then(function(response) {
            if(response.data.status == 100) {
              def.resolve();
            } else {
              def.reject();
            }
            //console.log(response)
          }, function(err) {
            def.reject();
          });

        return def.promise;
      };
    }
  };
})
.directive('checkUnique', function($q, $timeout,$http,$rootScope) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var checktype = attrs.checktype;
      //console.log('validation'+checktype);
      var url = '';
      var model = '';
      var field = '';
      if(checktype == 'business'){
        url = 'admin/checkUnique';
        model = 'businessTypes';
        field = 'name';
      } else if(checktype == 'editbusiness') {
        url = 'admin/editCheckUnique';
        model = 'businessTypes';
        field = 'name';
      } else if(checktype == 'category') {
        url = 'admin/checkUnique';
        model = 'categories';
        field = 'name';
      } else if(checktype == 'editcategory') {
        url = 'admin/editCheckUnique';
        model = 'categories';
        field = 'name';
      } else if(checktype == 'question') {
        url = 'admin/checkUnique';
        model = 'questions';
        field = 'question';
      } else if(checktype == 'editquestion') {
        url = 'admin/editCheckUnique';
        model = 'questions';
        field = 'question';
      } else if(checktype == 'client') {
        url = 'admin/checkUnique';
        model = 'client';
        field = 'name';
      } else if(checktype == 'editclient') {
        url = 'admin/editCheckUnique';
        model = 'client';
        field = 'name';
      } else if(checktype == 'advertisement') {
        url = 'admin/checkUnique';
        model = 'advertisements';
        field = 'name';
      } else if(checktype == 'editadvertisement') {
        url = 'admin/editCheckUnique';
        model = 'advertisements';
        field = 'name';
      }
      ctrl.$asyncValidators.checkUnique = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }
        var preval = attrs.preval;
        var def = $q.defer();
        var data = {name: modelValue,value:preval,model:model,field:field};
        $http.get(url,{params:data})
          .then(function(response) {
            if(response.data.status == 100) {
              def.resolve();
            } else {
              def.reject();
            }
            //console.log(response)
          }, function(err) {
            def.reject();
          });

        return def.promise;
      };
    }
  };
})
 .directive('pwCheck', function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }

  })
  .directive('checkPassword',['authApi','$q','$http', function (authApi,$q,$http) {
    return {
      require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
          ctrl.$asyncValidators.checkPassword = function(modelValue, viewValue) {

            if (ctrl.$isEmpty(modelValue)) {
              // consider empty model valid
              return $q.when();
            }
            var id = authApi.getId();
            var def = $q.defer();
            var data = {id:id,password: modelValue};
            $http.get('admin/ckeckOldPassword',{params:data})
              .then(function(response) {
                if(response.data.status == 100) {
                  def.resolve();
                } else {
                  def.reject();
                }
                //console.log(response)
              }, function(err) {
                def.reject();
              });

            return def.promise;
          };
        }
    }
  }])
 .directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
})
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    console.log(scope.imageShow);
                    scope.imageShow = false;
                });
            });
        }
    };
}]);