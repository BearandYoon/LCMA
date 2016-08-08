/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContractSectionEditCtrl', function ($scope, $uibModalInstance, ContractSection, $currentSection) {

      var section = $scope.section = angular.copy($currentSection),
        contract = $scope.contract = section.contract;


      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        ContractSection.update(section.id, section, {params: {contract_id: contract.id, id: section.id}})
          .then(function (data) {
            $uibModalInstance.close(data);
          });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
