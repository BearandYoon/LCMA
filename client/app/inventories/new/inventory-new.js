/**
 *
 */
(function () {
    'use strict';

  function InventoryNewCtrl($lcmaPage, $state, $stateParams, Inventory, Dictionary) {
    $lcmaPage.setTitle('New Inventory');

    var _this = this;

    _this.inventory = {

    };

    // get inventory type id
    Dictionary.getDictionary('inventory-type').then(function(types) {
      var type = _.find(types, {value: $stateParams.type});
      if (type) {
        _this.inventory.type_id = type.id;
      }
    });

    //
    _this.createInventory = function (form) {

      form.$setSubmitted();

      if(!form.$valid) {
        return;
      }

      Inventory.create(_this.inventory).then(function (inventory) {
        $state.go('app.inventoryEdit', {id: inventory.id});
      })

    };

    _this.cancelInventory = function () {
      $state.go('app.inventories');
    };


  }

  angular.module('lcma')
    .controller('InventoryNewCtrl', InventoryNewCtrl)

}());
