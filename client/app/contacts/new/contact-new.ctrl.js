/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContactNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Contact, Site, Vendor) {

      var contact = $scope.contact = {

      };

      $scope.sites = [];
      $scope.vendors = [];
      $scope.contacts = [];

      Site.findAll().then(function (sites) {
        $scope.sites = sites;
      });

      Vendor.findAll().then(function (vendors) {
        $scope.vendors = vendors;
      });

      Contact.findAll().then(function (contacts) {
        $scope.contacts = contacts;
      });

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Contact.create(contact)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
