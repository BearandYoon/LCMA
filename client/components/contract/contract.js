/**
 *
 */
(function () {
    'use strict';

  function ContractPickerDirective(Contract) {

    return {
      restrict: 'EA',
      replace:true,
      require: ['ngModel','ngDisabled'],
      template:'<select class="form-control" ng-options="contract.id as contract.name for contract in contracts"></select>',
      controller: function ($scope) {

        Contract.findAll().then(function (contracts) {
          $scope.contracts = contracts;
        });
      }
    };

  }

  angular.module('lcma')
    .directive('lcmaContractPicker', ContractPickerDirective);


}());
