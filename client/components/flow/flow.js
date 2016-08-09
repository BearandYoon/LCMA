/**
 *
 */
(function () {
  'use strict';

  function FlowDirective() {

    return {

      restrict: 'EA',
      scope: {
        scheme: '=scheme',
        currentStep: '@',
        onAction: '&'
      },
      templateUrl: 'components/flow/flow.html',
      link: function (scope, elem, attrs) {

        scope.action = function (item, action) {
          scope.onAction({item: item, action: action});
        }

      }

    };

  }

  function FlowProvider() {

    this.$get = function () {

      return function (schema) {

        var instance = {},
          current;

        instance.build = function flowBuild(scope, schema) {

        };

        instance.next = function flowNext() {

          var onNext = schema.onNext,
            indexOfCurrent = schema.indexOf(current) || 0;

          if (indexOfCurrent < schema.length - 1) {

            current = schema[indexOfCurrent + 1];

            if (onNext) {
              onNext();
            }
          }

        };

        return instance;


      }

    }

  }

  angular.module('lcma')
    .directive('lcmaFlow', FlowDirective)
    .provider('$lcmaFlow', FlowProvider);

}());
