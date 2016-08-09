/**
 *
 */
(function () {
    'use strict';

  function ContractHistoryDirective(History) {

    return {
      restrict: 'E',
      templateUrl: 'components/contract-history/contract-history.html',
      scope: {
        model: '=ngModel'
      },
      link: function (scope, elem, attrs) {

      }
    };
  }

  angular.module('lcma')
    .directive('lcmaContractHistory', ContractHistoryDirective )

}());
