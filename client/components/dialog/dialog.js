(function () {
  'use strict';

  function DialogProvider() {

    this.$get = ['$uibModal', function ($uibModal) {

      var locals = {
        buttonYesText: 'Yes',
        buttonNoText: 'No',
        buttonCloseText: 'Close'
      };

      var alertDefaults = {
        templateUrl: 'components/dialog/dialog-alert.html',
        controller: 'LcmaDialogAlertCtrl'
      };

      var confirmDefaults = {
        templateUrl: 'components/dialog/dialog-confirm.html',
        controller: 'LcmaDialogConfirmCtrl',
        size: 'sm'
      };

      var customDefaults = {};

      function alert(options) {

        var settings = angular.merge({}, alert, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      function open(options) {
        var settings = angular.extend({}, customDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      function confirm(options) {
        var settings = angular.extend({}, confirmDefaults, options);

        settings.resolve = settings.resolve || {};

        settings.resolve.$settings = function () {
          return angular.merge({}, locals, options);
        };

        return $uibModal.open(settings);
      }

      return {
        alert: alert,
        open: open,
        confirm: confirm
      };
    }];
  }

  function DialogAlertCtrl($scope, $settings, $uibModalInstance) {

    $scope.$settings = $settings;

    $scope.close = function () {
      $uibModalInstance.close();
    };

  }

  function DialogConfirmCtrl($scope, $settings, $uibModalInstance) {

    $scope.$settings = $settings;

    $scope.yes = function () {
      $uibModalInstance.close(true);
    };

    $scope.no = function () {
      $uibModalInstance.dismiss(false);
    };
  }

  angular.module('lcma')
    .provider('$lcmaDialog', DialogProvider)
    .controller('LcmaDialogAlertCtrl', DialogAlertCtrl)
    .controller('LcmaDialogConfirmCtrl', DialogConfirmCtrl)
  ;
}());
