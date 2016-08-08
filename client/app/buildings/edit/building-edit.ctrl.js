/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('BuildingEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentBuilding, Building) {

      var building = $scope.building = angular.copy($currentBuilding);

      var hierarchy = [];

      function collectionHierarchy(item) {

        angular.forEach(item.building, function (x) {
          hierarchy.push(x.id);
          collectionHierarchy(x);
        });

      }

      $scope.buildings = [];

      Building.findAll().then(function (buildings) {
        collectionHierarchy($currentBuilding);

        $scope.buildings = buildings.filter(function (x) {
          return x.id != building.id && hierarchy.indexOf(x.id) === -1;
        });
      });


      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Building.update(building.id, building)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
