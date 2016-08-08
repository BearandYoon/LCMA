/**
 * Created by bear on 2/29/16.
 */
(function () {
  'use strict';

  function EmployeesCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, Employee) {

    $lcmaPage.setTitle('Employee List');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'employees.csv',
      onRegisterApi: function (api) {
        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.employeeQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });
          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {
          $lcmaGridFilter(this.grid, _this.employeeQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));
          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editEmployee(row.entity)"><i class="fa fa-pencil"></i></a>'
      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeEmployee(row.entity, $index)"><i class="fa fa-trash"></i></a>'
      })
      .addColumn('id', 'Employee #')
      .addColumn('first_name', 'First Name')
      .addColumn('last_name', 'Last Name')
      .addColumn('home_site', 'Home Site')
      .addNumberColumn('mobile_number', 'Mobile Number')
      .addNumberColumn('office_number', 'Office Number')
      .addColumn('status', 'Status')
      .addNumberColumn('gl_code1', 'GL Code1')
      .addNumberColumn('gl_code2', 'GL Code2')
      .addNumberColumn('gl_code3', 'GL Code3')
      .addNumberColumn('gl_code4', 'GL Code4')
      .addNumberColumn('gl_code5', 'GL Code5')
      .addNumberColumn('gl_code6', 'GL Code6')
      .addNumberColumn('gl_code7', 'GL Code7')
      .addNumberColumn('gl_code8', 'GL Code8')
      .options();

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.employeeQuery.limit = _this.pager.size;
        _this.employeeQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds employees query.
     */
    _this.employeeQuery = {
      where: {},
      limit: _this.pager.size,
      offset: _this.pager.from() - 1
    };

    /**
     * Opens add employees dialog
     */
    _this.addEmployee = function () {
      $uibModal.open({
        templateUrl: 'app/employees/new/employee-new.html',
        controller: 'EmployeeNewCtrl'
      }).result.then(function (employee) {
          grid.data.push(employee);
          $lcmAlert.success('New employee has been created.');
        });
    };

    /**
     * Opens edit employee dialog
     */
    $scope.editEmployee = _this.editEmployee = function (employee) {
      $uibModal.open({
        templateUrl: 'app/employees/edit/employee-edit.html',
        controller: 'EmployeeEditCtrl',
        resolve: {
          $currentEmployee: function () {
            return employee;
          }
        }
      }).result.then(function (data) {
          angular.extend(employee, data);
          $lcmAlert.success('Employee info has been updated.');
        });
    };

    /**
     * Initiates employee remove.
     */
    $scope.removeEmployee = _this.removeEmployee = function (employee, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Employee?'
      }).result.then(function () {
          Employee.destroy(employee.id);
        });
    };

    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.employeeQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };

    _this.refresh = function () {
      Employee.findAll({filter: JSON.stringify(_this.employeeQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
          return data;
        });
    };

    _this.refresh();
  }

  angular.module('lcma')
    .controller('EmployeesCtrl', EmployeesCtrl);
}());
