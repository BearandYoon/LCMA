(function () {
  'use strict';

  angular.module('lcma')
    .factory('Vendor', function (DS) {

      return DS.defineResource({
        name: 'vendor'
      });
    });

}());
