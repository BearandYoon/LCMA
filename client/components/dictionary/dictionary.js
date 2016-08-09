/**
 *
 */
(function () {
    'use strict';

  function DictionaryPickerDirective(Dictionary) {

    return {
      restrict: 'EA',
      replace:  true,
      require: ['ngModel', 'ngDisabled'],
      template:'<select class="form-control" ng-options="ele.key as ele.value for ele in items"></select>',
      scope: {
        typeKey: '@',
        name: '@'
      },
      controller: function ($scope) {
        Dictionary.getDictionary($scope.typeKey).then(function (items) {
          $scope.items = items;
        });
      }
    };

  }

  angular.module('lcma')
    .directive('lcmaDictionaryPicker', DictionaryPickerDirective);


}());
