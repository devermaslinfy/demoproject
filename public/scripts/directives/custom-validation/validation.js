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
      if(emailType == 'user'){
        url = 'admin/userCheckEmail';
      } else {
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
         console.log(modelValue);
        var data = {email: modelValue};
        $http.get(url,{params:data})
          .then(function(response) {
            if(response.data.status == 100) {
              def.resolve();
            } else {
              def.reject();
            }
            console.log(response)
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
 .directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ctrl){
      var validFormats = ['jpg','jpeg','png'];
      console.log('linked');
      //change event is fired when file is selected
      el.bind('change',function(){
        scope.$apply(function(){
          var ext = el.val().substr(el.val().lastIndexOf('.')+1);
          console.log(ext);

              if(validFormats.indexOf(ext) == -1){
                  ctrl.$setValidity('extension', false);
              } else {
                ctrl.$setValidity('extension', true);
              }
          ctrl.$setViewValue(el.val());
          ctrl.$render();
        });
      });
    }
  }
});
 /*.directive('validFile',function(){
  return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ngModel) {
          console.log("Link was called");
          var validFormats = ['jpg','jpeg','png'];
          elem.bind('click', function () {
              scope.$apply(function () {
                  ngModel.$render();
              });
          });
          elem.bind('change', function () {
              validImage(false);
              scope.$apply(function () {
                  ngModel.$render();
              });
          });
          ngModel.$render = function () {
              ngModel.$setViewValue(elem.val());
          };
          function validImage(bool) {
            console.log(bool);
              ngModel.$setValidity('extension', bool);
          }
          ngModel.$parsers.push(function(value) {
              var ext = value.substr(value.lastIndexOf('.')+1);
              if(ext=='') return;
              if(validFormats.indexOf(ext) == -1){
                  return value;
              }
              validImage(true);
              return value;
          });
      }
    }
});*/