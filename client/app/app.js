'use strict';

angular.module('lcma', [
    'ngCookies',
    //'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'toastr',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'ngFileUpload',
    //'ngScrollbar',
    //'agGrid',
    'ui.grid',
    'ui.grid.pinning',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.edit',
    'js-data',
    'ui.grid.exporter',
    'treeGrid',
    'angular-loading-bar',
    'ngImgCrop',
    'mgcrea.ngStrap'
  ])
  // TODO: Move this to another file and support different configs by deployments system
  .constant('config', {
    APP_NAME: 'Cloud Age',
    API_HOST: '',
    API_PATH: '/api',
    REPORTING_BASE_URL: 'http://52.70.220.130:8080/Logi/',
    REPORTING_API_URL: '/api/report',
    REPORTING_SECURE_KEY: ''
  })
  .constant('_', window._)
  .controller('AppCtrl', function ($rootScope, $lcmaPage, $broadcast, $state, $me, $stat) {
    $rootScope.$me = $me;
    $rootScope.$stat = $stat;
    $rootScope._=window._;
  })

  .controller('MasterCtrl', function ($rootScope, $broadcast, $state, $lcmaPage) {
    $rootScope.$lcmaPage = $lcmaPage;


    // Catch system error 401
    $broadcast.on("system:error:401", function (e, obj) {
      $state.go('anonymous.login');
    });

    // Catch system error 403
    $broadcast.on("system:error:403", function (e, obj) {
      // Forbidden  - Display message
      $state.go('app.errorForbidden');
    });

    // Watching route state change
    $rootScope.$on('$stateChangeSuccess', function (event, toState /*, toParams, fromState, fromParams*/) {

      toState.data = toState.data || {};

      if (toState.data && toState.data.bodyClass) {
        $lcmaPage.setBodyClass(toState.data.bodyClass);
      }
      else {
        $lcmaPage.setBodyClass('');
      }
    });

    // Watching route state change
    $rootScope.$on('$stateChangeStart', function (event, toState /*, toParams, fromState, fromParams*/) {

      $lcmaPage.setTitle('');
    });
  })

  .config(function (config, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $lcmaGridProvider, $lcmaPagerProvider, DSProvider, DSHttpAdapterProvider) {
    // URL route provider configuration
    $urlRouterProvider
      .otherwise('/dash');

    $lcmaGridProvider.extendDefaults({
      enableSelectAll: true
    });

    $lcmaPagerProvider.extendDefaults({
      size: 20
    });

    // Register API interceptor
    $httpProvider.interceptors.push('apiInterceptor');

    // Top state all other will inherit
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        views: {
          'master@': {
            controller: 'AppCtrl',
            templateUrl: 'app/app.main.html'
          }
        },
        resolve: {
          $me: function (User) {
            return User.me().then(function (response) {
              return response.data;
            });
          },
          $permissions: function ($me, Permission) {
            return Permission.me();
          },
          $modules: function (AppModule) {
            return AppModule.findAll();
          },
          $roles: function (Role) {
            return Role.findAll();
          },
          $stat: function (Stat) {
            return Stat.findAll().then(function (response) {
              return response;
            });
          }
        }
      })
      .state('anonymous', {
        abstract: true,
        views: {
          'master@': {
            templateUrl: 'app/app.anonymous.html'
          }
        },
        data: {
          bodyClass: 'login-body'
        }

      });

    $locationProvider.html5Mode(true);

    angular.extend(DSProvider.defaults, {
      idAttribute: 'id',
      afterInject: function (resource, data) {

        if (angular.isArray(data) && data.length && data[0].$total) {
          var meta = data.shift();
          data.$total = meta.$total;
        }
        return data;
      }
    });

    angular.extend(DSHttpAdapterProvider.defaults, {
      basePath: config.API_PATH,

      deserialize: function deserialize(resourceConfig, response) {
        var resp = response ? ('data' in response ? response.data : response) : response;

        if (resp.items) {
          if(resp.items.length) {
            resp.items.unshift({id: -999, $total: resp.total});
          }
          return resp.items;
        }

        return resp;
      }
    });
  });
