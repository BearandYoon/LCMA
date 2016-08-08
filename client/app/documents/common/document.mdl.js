(function () {
  'use strict';

  angular.module('lcma')
    .factory('Document', function (DS) {

      return DS.defineResource({
        name: 'document',
        actions: {
          entity: {
            method: 'GET'
          }
        }
      });
    });

}());
