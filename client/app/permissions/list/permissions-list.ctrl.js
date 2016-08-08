/**
 *
 */
(function () {
  'use strict';

  function PermissionListCtrl($scope, $modules, $roles, $lcmAlert, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $uibModal, Permission) {

    $lcmaPage.setTitle('Permissions');

    var _this = this;

    _this.modules = $modules;

    /**
     * Permissions grid definition
     */
    var grid = _this.gridOptions = $lcmaGrid({
      exporterCsvFilename: 'permissions.csv',
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.permissionQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.permissionQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });

      }

    })

      .addCommandColumn('id', "", {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editPermission(row.entity)"><i class="fa fa-pencil"></i></a>'
      })
      .addColumn('role.name', "Role", {width: 180})
      .addColumn('module.title', "Module", {width: 180})
      .addColumn('actions', "Action", {

        width: 350,
        cellTemplate: '<div class="ui-grid-cell-contents"><span class="badge" style="margin-right: 5px;" ng-repeat="action in row.entity.actions">{{action.name}}</span></div>'
      })
      .addColumn('filters', "Filters", {
        width: 350,
        cellTemplate: '<div class="ui-grid-cell-contents"><span class="badge" style="margin-right: 5px;" ng-repeat="filter in row.entity.filters">{{filter.title}}</span></div>'
      })
      .options();


    /**
     * Opens view permission dialog
     */
    $scope.editPermission = _this.editPermission = function (permission) {

      $uibModal.open({
          templateUrl: 'app/permissions/edit/permissions-edit.html',
          controller: 'PermissionEditCtrl',
          size: 'md',
          resolve: {
            $currentPermission: function () {
              return permission;
            }
          }
        })
        .result.then(function (data) {
        angular.extend(permission, data);
        $lcmAlert.success('Permission has been updated');
      });

    };


    /**
     * Opens view permission dialog
     */
    _this.addPermission = function (permission) {

      $uibModal.open({
          templateUrl: 'app/permissions/new/permissions-new.html',
          controller: 'PermissionNewCtrl',
          size: 'md',
          resolve: {
            $modules: function () {
              return $modules;
            },
            $roles: function () {
              return $roles;
            }
          }
        })
        .result.then(function (data) {
        grid.data.push(data);
        $lcmAlert.success('Permission has been created');
      });

    };


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      limit: 1000,
      onGo: function () {
        _this.permissionQuery.limit = _this.pager.size;
        _this.permissionQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds invoice query.
     */
    _this.permissionQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.permissionQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);
    };

    /**
     * Selects current module.
     * @param module
     */
    _this.selectModule = function (module) {
      if (module !== _this.selectedModule) {
        _this.selectedModule = module;
        module
          ? _this.permissionQuery.where["module_id"] = {'===': module.key}
          : delete _this.permissionQuery.where["module_id"];

        _this.refresh();
      }
    };


    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {

      return Permission.findAll({filter: JSON.stringify(_this.permissionQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;

          return data;
        });
    };

    _this.refresh();

  }

  angular.module('lcma')
    .controller('PermissionListCtrl', PermissionListCtrl);


}());
