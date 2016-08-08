/**
 *
 */
(function () {
    'use strict';

  function InventoriesCtrl($scope, $state, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Inventory) {

    $lcmaPage.setTitle('Inventory List');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'inventories.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.inventoryQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.inventoryQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }

    })
    .addCommandColumn('edit', 'Edit', {
      cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.inventoryEdit({id: row.entity.id, type: row.entity.type.value})"><i class="fa fa-pencil"></i></a>'
    })
    .addCommandColumn('remove', 'remove', {
      cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeInventory(row.entity, $index)"><i class="fa fa-trash"></i></a>'
    })
    .addColumn('type.value', 'Type')
    .addColumn('vendor.name', 'Vendor')
    .addColumn('sp_id', 'SPID')
    .addColumn('internal_id', 'Internal ID')
    .addColumn('siteA.site_id', 'Site A')
    .addColumn('siteZ.site_id', 'Site Z')
    .addDateColumn('install_date', 'Install Date')
    .options();


    /**
     * Initiates Inventory remove.
     */
    $scope.removeInventory = _this.removeInventory = function (inventory, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Inventory?'
      }).result.then(function () {
        Inventory.destroy(inventory.id);
      });
    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.inventoryQuery.limit = _this.pager.size;
        _this.inventoryQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds sites query.
     */
    _this.inventoryQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Go to edit page with empty object: new action
     */
    _this.addInventory = function (type) {
      $state.go('app.inventoryNew', {type: type});
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
      _this.inventoryQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };

    _this.refresh = function () {
      Inventory.findAll({filter: JSON.stringify(_this.inventoryQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };

    _this.refresh();

  }

  angular.module('lcma')
    .controller('InventoriesCtrl', InventoriesCtrl);


}());
