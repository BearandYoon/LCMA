/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('SiteNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Site, SiteType, Vendor, Building) {

      var site = $scope.site = {

      };

      $scope.sites = [];

      $scope.types = [];

      SiteType.findAll()
        .then(function (items) {
          $scope.types = items;
        });

      Site.findAll().then(function (sites) {
        $scope.sites = sites;
      });

      Vendor.findAll().then(function (vendors) {
        $scope.vendors = vendors;
      });

      // Show all buildings

      Building.findAll().then(function (buildings) {
        $scope.buildings = buildings;
      });

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Site.create(site)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
