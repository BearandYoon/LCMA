/**
 *
 */
(function () {
  'use strict';

  function AdvancedFilterDirective($lcmaAdvancedFilter) {

    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'components/advanced-filter/advanced-filter.html',
      scope: {
        properties: '=properties',
        context: '=ngModel'
      },
      link: function (scope, elem, attrs) {

        var currentFilterProperty;

        scope.operators = {
          number: [
            {title: 'Less Then', value: '<', editor: 'number'},
            {title: 'Different Then', value: '!==', editor: 'number'},
            {title: 'Equal', value: '===', editor: 'number'},
            {title: 'Greater Then', value: '>', editor: 'number'},
            {title: 'Between', value: '<>', editor: 'number-between'}
          ],
          date: [
            {title: 'Before', value: '<', editor: 'date'},
            {title: 'After', value: '>', editor: 'date'},
            {title: 'Between', value: '<>', editor: 'date-between'}
          ],
          text: [
            {title: 'Equal', value: '===', editor: 'text'},
            {title: 'Contains', value: '*', editor: 'text'},
            {title: 'Start With', value: '^', editor: 'text'}
          ]
        };

        scope.$watch('context.property', function (x) {
          if(!x || currentFilterProperty !== x.name) {
            currentFilterProperty = x ? x.name : undefined;
            delete scope.context.operator;
            delete scope.context.value;
          }
        });

      }
    };

  }

  function AdvancedFilterProvider() {


    this.$get = function () {

      var instance = {};

      // select field
      // display list of operators based on field type
      // display value selector based on field type and selected operator


      return instance;

    };
  }

  function AdvancedFilterDirectiveEditor() {
    return {
      restrict: 'EA',
      replace: true,
      template: '<ng-include src="templateUrl"></ng-include>',
      scope : {
        model: '=ngModel',
        editor: '@'
      },
      link: function (scope, elem, attrs) {


        scope.onModelChange = function (model) {
          scope.model = model;
        };

        scope.$watch('editor', function (x) {
          if(x) {
            scope.templateUrl = 'components/advanced-filter/advanced-filter-' + x + '.html'
          }
        });

      }
    };
  }

  angular.module('lcma')
    .provider('$lcmaAdvancedFilter', AdvancedFilterProvider)
    .directive('lcmaAdvancedFilter', AdvancedFilterDirective)
    .directive('lcmaAdvancedFilterEditor', AdvancedFilterDirectiveEditor)
  ;

}());
