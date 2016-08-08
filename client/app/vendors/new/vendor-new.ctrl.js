/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('VendorNewCtrl', function ($scope, $uibModalInstance, Vendor) {

    var vendor = $scope.vendor = {};


      $scope.create = function (form) {

        form.$setSubmitted();

        if(!form.$valid) {
          return;
        }

        Vendor.create({
          name: vendor.name,
          code: vendor.code,
        }).then(function (vendor) {
          $uibModalInstance.close(vendor);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
