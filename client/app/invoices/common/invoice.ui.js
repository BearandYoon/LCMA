/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaInvoiceStatusView', function () {

      var statuses = [
        {key: -1, value: 'All'},
        {key: 0, value: 'Quarantined', cssClass:'danger'},
        {key: 1, value: 'New', cssClass: 'muted'},
        {key: 2, value: 'RfA', cssClass: 'info'},
        {key: 3, value: 'Approved', cssClass: 'success'},
        {key: 4, value: 'GL Coded', cssClass: 'warning'}
      ];

      function getStatus(key) {

        for(var i=0;i<statuses.length;i++) {
          var s = statuses[i];
          if(s.key == key) {
            return s;
          }
        }
      }

      return {
        restrict: 'EA',
        scope: {
          model: '=ngModel'
        },
        link: function (scope, elem, attrs) {
          scope.$watch('model', function (val) {
            var status = getStatus(val);
            if(status) {
              elem.html('<span class="text-' + status.cssClass + '">' + status.value + '</span>');
            }
          });
        }
      };


    });

}());
