/**
 * Created by mac on 2/19/16.
 */
/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContactEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentContact, Contact, Site, Vendor) {

      var contact = $scope.contact = angular.copy($currentContact);

      var hierarchy = [];

      function collectionHierarchy(item) {

        angular.forEach(item.contact, function (x) {
          hierarchy.push(x.id);
          collectionHierarchy(x);
        });
      }

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
        collectionHierarchy($currentContact);

        $scope.contacts = contacts.filter(function (x) {
          return x.id != contacts.id && hierarchy.indexOf(x.id) === -1;
        });
      });

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Contact.update(contact.id, contact)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
