/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('OrderEditCtrl', function ($scope, $uibModalInstance, order, Order, OrderStatus) {

    $scope.order = angular.copy(order);


      OrderStatus.findAll().then(function (statuses) {
        $scope.statuses = statuses;
      });

      $scope.update = function (form) {

        if(!form.$valid) {
          return;
        }

        Order.update(order.id, $scope.order).then(function (acc) {
          $uibModalInstance.close(acc);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
