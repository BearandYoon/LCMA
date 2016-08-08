'use strict';

angular.module('lcma')
  .controller('UsersCtrl', function ($scope, $roles, $lcmaGrid, $lcmaPager, $lcmaPage, $lcmaGridFilter, $uibModal, $lcmAlert, User) {

    $lcmaPage.setTitle('User List');

    var _this = this;
    var grid = _this.gridOptions = $lcmaGrid({
      exporterCsvFilename: 'users.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.userQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.userQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editUser(row.entity)"><i class="fa fa-pencil"></i></a>'
      })
      /*      .addCommandColumn('remove', 'remove', {
       cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeUser(row.entity, $index)"><i class="fa fa-trash"></i></a>',

       })*/
      .addColumn('username', 'Username')
      .addColumn('email', 'Email')
      .addColumn('first_name', 'First Name')
      .addColumn('last_name', 'Last Name')
      .addColumn('mobile_number', 'Mobile Number')
      .addBooleanColumn('is_active', 'Active', {width: 50})
      .addColumn('roles', "Roles", {

        width: 350,
        cellTemplate: '<div class="ui-grid-cell-contents"><span class="badge" style="margin-right: 5px;" ng-repeat="role in row.entity.roles">{{role.name}}</span></div>'
      })
      .options();


    /**
     * Opens add user dialog
     */
    _this.addUser = function () {

      $uibModal.open({
        templateUrl: 'app/users/new/user-new.html',
        controller: 'UserNewCtrl',
        resolve: {
          $roles: function () {
            return $roles;
          }
        }
      }).result.then(function (user) {
        grid.data.push(user);
        $lcmAlert.success('User has been created');
      }, function () {

        // TODO: Catch error

      });

    };

    /**
     * Opens edit user dialog
     */
    $scope.editUser = _this.editUser = function (user) {

      $uibModal.open({
        templateUrl: 'app/users/edit/user-edit.html',
        controller: 'UserEditCtrl',
        resolve: {
          userId: function () {
            return user.id;
          },
          $roles: function () {
            return $roles;
          },
          avatar: function () {
            return user.avatar;
          }
        }
      }).result.then(function (userUpdate) {
        user = userUpdate;
        $lcmAlert.success('User has been updated');
      });

    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.userQuery.limit = _this.pager.size;
        _this.userQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds user query.
     */
    _this.userQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.userQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    _this.refresh = function () {
      User.findAll({filter: JSON.stringify(_this.userQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };

    _this.refresh();

  });
