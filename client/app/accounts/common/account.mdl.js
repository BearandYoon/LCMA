(function () {
  'use strict';

  angular.module('lcma')
    .factory('Account', function (DS) {

      return DS.defineResource({
        name: 'account'
      });
    });

}());
