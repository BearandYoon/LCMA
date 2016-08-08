/**
 *
 */
(function () {
    'use strict';

  function HistoryFactory(DS) {

    return DS.defineResource({
      name: 'history'
    });
  }

  angular.module('lcma')
    .factory('History', HistoryFactory)

}());
