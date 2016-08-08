(function () {
  'use strict';

  angular.module('lcma')
    .factory('Order', function (DS) {

      return DS.defineResource({
        name: 'order'
      });
    });

}());
