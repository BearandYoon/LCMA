/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaListFilter', function () {

      return {
        restrict: 'EA',
        template: '<a uib-popover-template="popoverOptions.templateUrl" popover-append-to-body="true" popover-is-open="popoverOptions.isOpen" popover-placement="bottom" popover-title="{{popoverOptions.title}}" type="button" class="btn btn-default btn-block btn-xs">{{ displayValue }}</a>',
        scope: {
          model: '=ngModel',
          options: '=filterOptions'
        },
        link: function (scope, elem, attrs) {

          var filter = scope.filter = {};

          scope.displayValue = '...';

          scope.popoverOptions = {
            templateUrl: 'components/list-filter/list-filter.html',
            title: 'List Filter'
          };

          scope.$watch('model', function (val) {
            if(!val) {
              scope.clearFilter();
            }
          });

          scope.selectionChange = function (option) {
            if (option.selected && option.value === -1) {
              scope.options.forEach(function (x) {
                if (x.value != -1) {
                  x.selected = false;
                }
              });
            }
            else if(option.selected) {
              var neutral = scope.options.filter(function (x) {
                return x.value === -1 || !x.value;
              })[0];

              if(neutral) {
                neutral.selected = false;
              }
            }
          };

          scope.applyFilter = function () {

            var selected = scope.options
              .filter(function (x) {
                return x.selected && x.value !== -1;
              });

            var values = selected.map(function (x) {
              return x.value;
            });

            if (values) {
              var res = {operator: 'in', value: values.length ? values: undefined};
              scope.model = JSON.stringify(res);

              if (values.length > 1) {
                scope.displayValue = values.length + ' selected';
              }

              else if (values.length === 1) {
                scope.displayValue = selected[0].label;
              }
              else {
                scope.displayValue = '...';
              }

              scope.popoverOptions.isOpen = false;
            }
          };

          scope.clearFilter = function () {
            scope.model = undefined;
            scope.displayValue = '...';
            scope.popoverOptions.isOpen = false;
            scope.filter = {};
          };

          scope.close = function () {
            scope.popoverOptions.isOpen = false;
          };


        }
      };

    })
}());
