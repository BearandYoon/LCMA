/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaNumberFilter', function () {

      return {
        restrict: 'EA',
        template: '<a uib-popover-template="popoverOptions.templateUrl" popover-append-to-body="true" popover-is-open="popoverOptions.isOpen" popover-placement="bottom" popover-title="{{popoverOptions.title}}" type="button" class="btn btn-default btn-block btn-xs">{{filter.operator && filter.value ? (filter.operator + filter.value) : "..."  }}</a>',
        scope: {
          model: '=ngModel'
        },
        link: function (scope, elem, attrs) {
          console.log(scope.model);

          scope.filter = {
            operator: '>'
          };

          scope.$watch('model.term', function (val) {
            if(!val) {
              scope.clearFilter();
            }
          });

          scope.popoverOptions = {
            templateUrl: 'components/number-filter/number-filter.html',
            title: 'Number Filter'
          };

          scope.applyFilter = function () {
            scope.model = JSON.stringify(scope.filter);
            scope.popoverOptions.isOpen = false;
          };

          scope.clearFilter = function () {
            scope.model = undefined;
            scope.popoverOptions.isOpen = false;
            scope.filter = {
              operator: '>'
            };
          };

          scope.close = function () {
            scope.popoverOptions.isOpen = false;
          };
        }
      };

    })
}());
