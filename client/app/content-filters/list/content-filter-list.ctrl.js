/**
 *
 */
(function () {
  'use strict';

  function FilterListCtrl($scope, $modules, $lcmaPage, $lcmaGrid, $lcmaDialog, $lcmaGridFilter, $lcmAlert, $uibModal, ContentFilter) {

    $lcmaPage.setTitle('Permissions');

    var _this = this;

    _this.modules = $modules;
    _this.filters = [];

    _this.filterQuery = {
      where: {}
    };

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'sites.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.filterQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.filterQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }

    })
/*      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editFilter(row.entity)"><i class="fa fa-pencil"></i></a>',
      })*/
      .addCommandColumn('delete', 'Delete', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.deleteFilter(row.entity)"><i class="fa fa-trash"></i></a>',
      })
      .addColumn('module.title', 'Module')
      .addColumn('title', 'Title')
      .addColumn('type', 'Type')
      .addColumn('property_name', 'Property')
      .addColumn('operator', 'Operator', {
        cellClass: 'text-center'
      })
      .addColumn('value', 'Value', {
        enableFiltering: true,
        width: 300,
      })
      .options();

    _this.addFilter = function () {

      $uibModal.open({
        templateUrl: 'app/content-filters/new/content-filter-new.html',
        controller: 'ContentFilterNewCtrl',
        size: 'md',
        resolve: {
          $modules: function () {
            return $modules;
          }
        }
      }).result.then(function (data) {
        grid.data.push(data);
        $lcmAlert.success('Content filter has been created');
      });

    };

    $scope.editFilter = _this.editFilter = function (filter) {

      $uibModal.open({
        templateUrl: 'app/content-filters/edit/content-filter-edit.html',
        controller: 'ContentFilterEditCtrl',
        size: 'md',
        resolve: {
          $currentFilter: function () {
            return filter;
          },
          $modules: function () {
            return $modules;
          }
        }
      }).result.then(function (data) {
        angular.extend(filter, data);
        $lcmAlert.success('Content filter has been updated');
      });

    };

    $scope.deleteFilter = _this.deleteFilter = function (filter) {

      $lcmaDialog.confirm({
          titleText: 'Please confirm',
          bodyText: 'Are you sure you want to permanently remove this filter?'
        })
        .result.then(function () {
          ContentFilter.destroy(filter.id);
          $lcmAlert.success('Content filter has been deleted');
        });

    };


    /**
     * Selects current module.
     * @param module
     */
    _this.selectModule = function (module) {
      if (module !== _this.selectedModule) {
        _this.selectedModule = module;
        module
          ? _this.filterQuery.where["module_id"] = {'===': module.key}
          : delete _this.filterQuery.where["module_id"];

        _this.refresh();
      }
    };


    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {
      return ContentFilter.findAll({filter: JSON.stringify(_this.filterQuery)})
        .then(function (data) {
          grid.data = data;
          return data;
        });
    };

    _this.refresh();

  }

  angular.module('lcma')
    .controller('FilterListCtrl', FilterListCtrl);


}());
