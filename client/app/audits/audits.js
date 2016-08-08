'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.audits', {
        url: '/audit',
        views: {
          "main@app": {
            templateUrl: 'app/audits/list/audit-list.html',
            controller: 'AuditsCtrl as ctx'
          }
        }
      })
      .state('app.auditDetails', {
        url: '/audit/:id',
        views: {
          "main@app": {
            templateUrl: 'app/audits/audit/audit-show.html',
            controller: 'AuditShowCtrl as ctx'
          }
        }
      });
  });
