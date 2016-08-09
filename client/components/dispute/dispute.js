(function () {
  'use strict';

  var statuses = [
    {id: 1, value: 'Filed'},
    {id: 2, value: 'Closed - Won'},
    {id: 3, value: 'Closed - Lost'}
  ];

  function DisputeStatusFilter() {
    return function (input) {

      var status = findStatus(input);

      return status ? status.value : 'N/A';

    };

    function findStatus(key) {
      for (var i = 0; i < statuses.length; i++) {
        if (statuses[i].id === key) {
          return statuses[i];
        }
      }
    }
  }

  angular.module('lcma')
    .filter('lcmaDisputeStatus', DisputeStatusFilter);

}());
