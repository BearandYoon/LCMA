/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('VendorEditCtrl', function ($scope, $uibModalInstance, vendor, Vendor) {

      $scope.vendor = angular.copy(vendor);

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Vendor.update(vendor.id, $scope.vendor).then(function (vendor) {
          $uibModalInstance.close(vendor);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
