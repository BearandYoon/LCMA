(function () {
  'use strict';

  angular.module('lcma')
    .factory('ContractSection', function (DS) {

      return DS.defineResource({
        name: 'contractSection',
        endpoint: 'section',
        relations: {
          belongsTo: {
            contract: {
              parent: true,
              localKey: 'contract_id',
              localField: 'contract'
            }
          }
        }
      });
    });

}());
