(function () {
  'use strict';

  angular.module('lcma')
    .factory('Dispute', function (DS) {

      return DS.defineResource({
        name: 'dispute'
      });
    });

}());
