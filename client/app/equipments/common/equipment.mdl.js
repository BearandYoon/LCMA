/**
 * Created by bear on 2/22/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('Equipment', function (DS) {
      return DS.defineResource({
        name: 'equipments'
      });
    });

}());
