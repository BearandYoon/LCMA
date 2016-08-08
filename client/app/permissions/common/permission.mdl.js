/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Permission', function (DS) {
      return DS.defineResource({
        name: 'permission',
        actions: {
          me: {
            method: 'GET'
          }
        }
      });
    });

}());
