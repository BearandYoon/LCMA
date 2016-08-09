/**
 *
 */
(function () {
  'use strict';

  function EmployeePickerDirective(Employee) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/employee/employee.html',
      controller: function ($scope) {
        $scope.selection = {value: null};

        function select(){
          $scope.employees.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection.value = item;
            }
          })
        }

        Employee.findAll().then(function (employees) {
          $scope.employees = employees;

          select();
        });

        $scope.onSelect = function (item, model) {
          $scope.model = item.id;
        };

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaEmployeePicker', EmployeePickerDirective);


}());
