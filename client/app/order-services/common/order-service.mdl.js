(function () {
  'use strict';

  angular.module('lcma')
    .factory('OrderService', function (DS) {

      return DS.defineResource({
        name: 'order-service'
      });
    });

}());
