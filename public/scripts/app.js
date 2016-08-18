'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ngStorage',
    'ui.bootstrap',
    'angular-loading-bar',
    'chart.js',
    'datatables',
    'datatables.bootstrap',
    'datatables.buttons',
    'datatables.util',
    'ngResource',
    'ngMessages',
    'ngFileUpload',
    'multipleSelect'
  ])
  .config(['$stateProvider','$httpProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$httpProvider,$urlRouterProvider,$ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });
    $httpProvider.interceptors.push('tokenInjector');
/*    $httpProvider.interceptors.push(function($q,$localStorage,$location ) {
        return {
         'request': function(config) {

                var token = $localStorage['token']
          //console.log(token);
          if (token == null || (config.noToken && config.noToken === true)) {
            //return config;
            $location.path('/login');
          }
          config.headers['x-access-token'] = $localStorage['token'];
         
          return config;
          },
          responseError: function(response) {
          if(response.status === 102  || response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
        }
        };
      });*/
/*    function httpInterceptorConfig($httpProvider) {
      $httpProvider.interceptors.push('tokenInjector');
    }*/
    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                    'scripts/services/auth.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js',
              'scripts/services/auth.js',
              'scripts/controllers/login.js'
              ]
            }),
            $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            })
          }
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form',
        controller:'UserCtrl',
        controllerAs:'UserCtrl',
        params: {
        'id': '', 
        'editMode': '',
        'user':''
      },
      resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/user.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.viewUser',{
        templateUrl:'views/viewUser.html',
        url:'/viewUser',
        controller:'UserCtrl',
        controllerAs:'UserCtrl',
        params: {
        'id': '', 
        'editMode': '',
        'user':'',
        'social':''
      },
      resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/user.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.clientform',{
        templateUrl:'views/client_form.html',
        url:'/clientform/:id',
        controller:'ClientCtrl',
        controllerAs:'ClientCtrl',
        params: {
        'addMode':''
        },
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/user.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.advertform',{
        templateUrl:'views/advert_form.html',
        url:'/advertform/:id/',
        controller:'AdvertisementCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/advertisement.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.catform',{
        templateUrl:'views/category_form.html',
        url:'/catform/:id',
        controller:'CategoryCtrl',
        controllerAs:'CategoryCtrl',
         params: {
        'id': '', 
        'editModeCat': '',
        'category':''
        },
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/category.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.businessform',{
        templateUrl:'views/bussiness_form.html',
        url:'/businessform',
        controller:'BusinessCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/advertisement.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.editBusiness',{
        templateUrl:'views/bussiness_editform.html',
        url:'/editBusiness/:id',
        controller:'BusinessCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/advertisement.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.password',{
        templateUrl:'views/password.html',
        url:'/setPassword',
        controller:'AdminCtrl',
        controllerAs:'AdminCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/main.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.adminform',{
        templateUrl:'views/admin_form.html',
        url:'/adminform/:id',
        controller:'AdminCtrl',
        controllerAs:'AdminCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/main.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.profile',{
        templateUrl:'views/profile.html',
        url:'/profile/:id',
        controller:'AdminCtrl',
        controllerAs:'AdminCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/main.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.questform',{
        templateUrl:'views/question_form.html',
        url:'/questform/:id',
        controller:'QuestionCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/category.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login',
        controller:'LoginCtrl',
        params: {
        'status': ''
        },
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/login.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('forgotpass',{
        templateUrl:'views/pages/forgotpass.html',
        url:'/forgotpass',
        controller:'LoginCtrl',
        params: {
        'status': ''
        },
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/login.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('resetpass',{
        templateUrl:'views/pages/resetpass.html',
        url:'/resetpass/:id',
        controller:'LoginCtrl',
        params: {
        'status': ''
        },
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/login.js',
                'scripts/directives/custom-validation/validation.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
      .state('logout',{
        //templateUrl:'views/pages/login.html',
        url:'/logout',
        controller:'LoginCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/login.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.users',{
        templateUrl:'views/table.html',
        url:'/users',
        controller:'UserCtrl',
        controllerAs:'UserCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/user.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.admins',{
        templateUrl:'views/admins.html',
        url:'/admins',
        controller:'AdminCtrl',
        controllerAs:'AdminCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/main.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.clients',{
        templateUrl:'views/clients.html',
        url:'/clients',
        controller:'ClientCtrl',
        controllerAs:'ClientCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/user.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.categories',{
        templateUrl:'views/category.html',
        url:'/categories',
        controller:'CategoryCtrl',
        controllerAs:'CategoryCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/category.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.questions',{
        templateUrl:'views/question.html',
        url:'/questions',
        controller:'QuestionCtrl',
        controllerAs:'QuestionCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/category.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
    .state('dashboard.advertisements',{
        templateUrl:'views/advertisement.html',
        url:'/advertisements',
        controller:'AdvertisementCtrl',
        controllerAs:'AdvertisementCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/advertisement.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
      .state('dashboard.business',{
        templateUrl:'views/business.html',
        url:'/business',
        controller:'BusinessCtrl',
        controllerAs:'BusinessCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/advertisement.js',
                'scripts/services/auth.js']
            })
          }
        }
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
  }]);

    
