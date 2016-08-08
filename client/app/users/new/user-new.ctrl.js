/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('UserNewCtrl', function ($scope, $roles, $lcmaGrid, $uibModalInstance, User) {

      $scope.roles = $roles;
      $scope.selectedRoles = {};
      $scope.avatar_temp = '';
      $scope.showCropImage = false;
      var user = $scope.user = {
        is_active: true
      };

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        if ($scope.showCropImage) {
          $scope.user.avatar = $scope.avatar_temp;
        }
        // Parse approved actions
        user.roles = [];
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

        User.resizedataURL($scope.user.avatar, function(dataUrl) {
          $scope.user.avatar = dataUrl;
          User.create({
            email: $scope.user.email,
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            password: $scope.user.password,
            password_confirm: $scope.user.password_confirm,
            username: $scope.user.username,
            roles: $scope.user.roles,
            avatar: $scope.user.avatar
          }).then(function (user) {
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
