/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('UserEditCtrl', function ($scope, $roles, $lcmaGrid, $uibModalInstance, userId, avatar, User) {

      $scope.roles = $roles;
      $scope.selectedRoles = {};
      $scope.avatar_temp = '';
      $scope.showCropImage = false;
      $scope.picFile = '';

      /**
       * Collect all data.
       */

      $scope.query = function () {
        User.find(userId).then(function (user) {

          angular.forEach(user.roles, function (role) {

            $scope.selectedRoles[role.id] = true;
          });

          $scope.user = user;
          $scope.user.avatar = avatar;
        });
      };

      $scope.query();

/*      $scope.watch('picFile', function() {
        console.log('avatar Image changed');
      });*/
      /**
       * Initiates update of user details.
       * @param form
         */
      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        if ($scope.showCropImage) {
          $scope.user.avatar = $scope.avatar_temp;
        }

        // Parse approved actions
        $scope.user.roles = [];
        angular.forEach($scope.selectedRoles, function (value, key) {
          if(value) {
            $scope.user.roles.push(key);
          }
        });

        User.resizedataURL($scope.user.avatar, function(dataUrl) {
          $scope.user.avatar = dataUrl;
          User.update(userId, $scope.user).then(function (user) {
            $uibModalInstance.close(user);
          });
        });
      };

      $scope.EditPicture = function() {
        $scope.showCropImage = true;
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
