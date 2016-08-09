/**
 *
 */
(function () {
    'use strict';

  function InvoiceHistoryDirective(History) {

    return {
      restrict: 'E',
      templateUrl: 'components/invoice-history/invoice-history.html',
      scope: {
        model: '=ngModel'
      },
      link: function (scope, elem, attrs) {
      }
    };
  }

  angular.module('lcma')
    .directive('lcmaInvoiceHistory', InvoiceHistoryDirective )

}());
