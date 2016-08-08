/**
 *
 */
(function () {
    'use strict';

  function OrderNewCtrl($lcmaPage, $state, Order) {
    $lcmaPage.setTitle('New Order');

    var _this = this;

    _this.order = {

    };

    _this.createOrder = function (form) {

      form.$setSubmitted();

      if(!form.$valid) {
        return;
      }

      Order.create(_this.order).then(function (order) {
        $state.go('app.orderEdit', {id: order.id});
      })

    };

    _this.cancelOrder = function () {
      $state.go('app.orders');
    };


  }

  angular.module('lcma')
    .controller('OrderNewCtrl', OrderNewCtrl)

}());
