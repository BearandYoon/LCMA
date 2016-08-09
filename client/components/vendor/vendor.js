/**
 *
 */
(function () {
    'use strict';

  function VendorPickerDirective(Vendor) {

    return {
      restrict: 'EA',
      replace:true,
      require: ['ngModel','ngDisabled'],
      template:'<select class="form-control" ng-options="vendor.id as vendor.name for vendor in vendors"></select>',
      controller: function ($scope) {

        Vendor.findAll().then(function (vendors) {
          $scope.vendors = vendors;
        });
      }
    };

  }

  angular.module('lcma')
    .directive('lcmaVendorPicker', VendorPickerDirective);


}());
