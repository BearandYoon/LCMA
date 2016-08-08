/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
      .controller('RoleNewCtrl', function ($scope, $roles, $lcmaGrid, $uibModalInstance, Role) {

      $scope.roles = $roles;


      var role = $scope.role = {

      };

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }
        Role.create({
          name: role.name
        }).then(function (role) {
          $uibModalInstance.close(role);
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
