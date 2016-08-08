/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContractDocumentManagerCtrl', function ($scope, $timeout, $lcmAlert, $uibModalInstance, $currentContract, $settings, Contract, Upload) {

      $scope.data = {
        progressStyle: {width: '0%'}
      };

      // TODO: This part is not solved properly and requires refactoring
      var url = $settings.url || '/api/contract/' + $currentContract.id + '/document';

      $scope.setFiles = function (files) {
        $timeout(function () {
          var file = files ? files[0] : null;
          $scope.files = files;
          $scope.data.files = {
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath
          };

        });
      };

      $scope.upload = function (form) {

        if (!form.$valid && $scope.data.files.type) {
          return;
        }

        Upload.upload({
            url: url,
            data: {
              files: $scope.files,
              contract: $currentContract
            }
          })
          .then(function (response) {
            $timeout(function () {
              $uibModalInstance.close(response.data);
            });
          }, function (response) {
            if (response.status > 0) {
              $lcmAlert.error('Failed to upload file. Try again.')
            }
          }, function (evt) {
            $scope.data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            $scope.data.progressStyle.width = $scope.data.progress + '%';
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    })
    .controller('EntityDocumentManagerCtrl', function ($scope, $timeout, $uibModalInstance, $entity, $document, $settings, Document, Upload) {

      $scope.data = {
        progressStyle: {width: '0%'}
      };

      // TODO: This part is not solved properly and requires refactoring
      var url = $settings.url,
        method = 'POST';

      if (!url) {
        url = $document ? '/api/document/' + $document.id : '/api/document/';
        if ($document) {
          method = 'PUT';
        }
      }

      $scope.setFiles = function (files) {
        $timeout(function () {
          var file = files ? files[0] : null;
          $scope.files = files;
          $scope.data.files = {
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath
          };

        });
      };

      $scope.upload = function (form) {

        if (!form.$valid && $scope.data.files.type) {
          return;
        }

        Upload.upload({
            url: url,
            method: method,
            data: {
              files: $scope.files,
              entity: $entity,
              document: $document
            }
          })
          .then(function (response) {
            $timeout(function () {
              $uibModalInstance.close(response.data);
            });
          }, function (response) {
            if (response.status > 0) {
              $lcmAlert.error('Failed to upload file. Try again.')
            }
          }, function (evt) {
            $scope.data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            $scope.data.progressStyle.width = $scope.data.progress + '%';
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
