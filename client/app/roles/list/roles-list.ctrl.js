'use strict';

angular.module('lcma')
  .controller('RolesCtrl', function ($scope, $roles, $lcmaGrid, $lcmaPager, $lcmaPage, $lcmaGridFilter, $uibModal, $lcmAlert, Role) {

    $lcmaPage.setTitle('Role List');

    var _this = this;
    var grid = _this.gridOptions = $lcmaGrid({
      exporterCsvFilename: 'roles.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.roleQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.roleQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editRole(row.entity)"><i class="fa fa-pencil"></i></a>',

      })
      .addColumn('name', 'Name', {width: 300})
      .addNumberColumn('user_in_roles.length', 'No of Users')
      .options();


    /**
     * Opens add role dialog
     */
    _this.addRole = function () {

      $uibModal.open({
        templateUrl: 'app/roles/new/role-new.html',
        controller: 'RoleNewCtrl',
        resolve: {
          $roles: function () {
            return $roles;
          }
        }
      }).result.then(function (role) {
        grid.data.push(role);
        $lcmAlert.success('Role has been created');
      }, function () {

        // TODO: Catch error

      });

    };

    /**
     * Opens edit role dialog
     */
    $scope.editRole = _this.editRole = function (role) {

      $uibModal.open({
        templateUrl: 'app/roles/edit/role-edit.html',
        controller: 'RoleEditCtrl',
        resolve: {
          $currentRole: function () {
            return role;
          },
          $roles: function () {
            return $roles;
          }

        }
      }).result.then(function (roleUpdate) {
        angular.extend(role, roleUpdate);
        $lcmAlert.success('Role has been updated');
      });

    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.roleQuery.limit = _this.pager.size;
        _this.roleQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds role query.
     */
    _this.roleQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.roleQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    _this.refresh = function () {
      Role.findAll({filter: JSON.stringify(_this.roleQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };

    _this.refresh();

  });
