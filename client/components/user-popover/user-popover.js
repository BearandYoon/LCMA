/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaUserPopOver', function () {

      return {
        restrict: 'EA',
        templateUrl: 'components/user-popover/user-popover.html',
//        template: '<a class="Popover-toggle" uib-popover-template="popoverOptions.templateUrl" popover-append-to-body="true" popover-trigger="hover" popover-placement="top" popover-title="{{popoverOptions.title}}">{{ displayValue }}</a>',
        scope: {
          user: '=ngModel'
        },
        link: function (scope, elem, attrs) {

          scope.full_name = scope.user.first_name + ' ' + scope.user.last_name;
          scope.displayValue = scope.full_name;

          if (scope.user.is_active) {
            scope.user_state = 'Yes';
          }
          else {
            scope.user_state = 'No'
          }

          scope.popoverOptions = {
            templateUrl: 'components/user-popover/user-popover.html',
            title: scope.full_name,
//            title: 'Popover',
            content: 'Hello Popover This is a multiline message!'
          };
        }
      };
    })
}());
