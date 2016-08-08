/**
 *
 */
(function () {
    'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {

    $stateProvider
      .state('app.errorForbidden', {
        url: '/forbidden',
        views: {
          "main@app": {
            templateUrl: 'app/errors/forbidden.html'
          }
        }
      });

  })

}());
