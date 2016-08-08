(function () {
  'use strict';

  angular.module('lcma')
    .factory('InventorySite', function (DS) {

      return DS.defineResource({
        name: 'inventorySite',
        endpoint: 'site',
        relations: {
          belongsTo: {
            inventory: {
              parent: true,
              localKey: 'inventory_id',
              localField: 'inventory'
            }
          }
        }
      });
    });

}());
