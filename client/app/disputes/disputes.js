'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.disputes', {
        url: '/disputes',
        views: {
          "main@app": {
            templateUrl: 'app/disputes/list/dispute-list.html',
            controller: 'DisputesCtrl as ctx'
          }
        }
      })
      .state('app.disputeDetails', {
        url: '/dispute/:id',
        views: {
          "main@app": {
            templateUrl: 'app/disputes/dispute/dispute-show.html',
            controller: 'DisputeShowCtrl as ctx'
          }
        }
      });
  });
