/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Inventory', function (DS) {

      function transform(instance) {

        if(instance.id > 0) {
          instance.disc_date = instance.disc_date ? (new Date(instance.disc_date)) : null;
          instance.install_date = instance.install_date ? (new Date(instance.install_date)) : null;
          instance.exp_date = instance.exp_date ? (new Date(instance.exp_date)) : null;
        }

      }

      return DS.defineResource({
        name: 'inventory',
        actions: {
          sites: {
            method: 'GET'
          }
        },
        relations: {
          hasMany: {
            sites: {
              localField: 'inventory_site',
              foreignKey: 'inventory_id'
            }
          }
        },
        afterInject: function (resource, data) {

          if(angular.isArray(data) && data.length && data[0].$total) {
            var meta = data.shift();
            data.$total = meta.$total;
          }

          if(angular.isArray(data)) {
            angular.forEach(data, function (instance) {
              transform(instance);
            });
          }
          else {
            transform(data);
          }

          return data;
        }
      });
    });

}());
