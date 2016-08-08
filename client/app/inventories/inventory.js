/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider
        .state('app.inventories', {
          url: '/inventories',
          views: {
            'main@app' : {
              controller: 'InventoriesCtrl as ctx',
              templateUrl: 'app/inventories/list/inventory-list.html'
            }
          }
        })
        .state('app.inventoryNew', {
          url: '/inventories/new/:type',
          views: {
            'main@app' : {
              controller: 'InventoryNewCtrl as ctx',
              templateUrl: function($stateParams) {

                if ('ckt' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-circuit.html';
                }
                else if ('wireline' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-wireline.html';
                }
                else if ('mobile' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-mobile.html';
                }
              }
            }
          }
        })
        .state('app.inventoryEdit', {
          url: '/inventories/:id/edit',
          resolve: {
            $currentInventory: function ($stateParams, Inventory) {
              return Inventory.find($stateParams.id);
            }
          },
          views: {
            'main@app' : {
              controller: 'InventoryEditCtrl as ctx',

              templateUrl: function() {
                return 'app/inventories/edit/inventory-edit.html';
              }
            }
          }
        })
        .state('app.inventoryDetails', {
          url: '/inventories/:id/:type',
          views: {
            'main@app' : {
              controller: 'InventoryShowCtrl as ctx',
              templateUrl: function($stateParams, Inventory) {

                if ('Ckt' === $stateParams.type) {
                  return 'app/inventories/show/inventory-circuit-show.html';
                }
                else if ('Wireless' === $stateParams.type) {
                  return 'app/inventories/show/inventory-wireless-show.html';
                }
              }
            }
          }
        })
      ;

    });

}());
