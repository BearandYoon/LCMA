'use strict';

angular.module('lcma')
  .controller('VendorsCtrl', function ($scope, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $lcmaDialog, invoiceService, Vendor) {

    $lcmaPage.setTitle('Vendors');

    var _this = this;

    /**
     * Holds grid settings
     * @type {settings}
     */
    var grid = _this.vendorsGrid = $lcmaGrid({
      exporterCsvFilename: 'vendors.csv',
      onRegisterApi: function (api) {
        _this.vendorsGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.vendorQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.vendorQuery)
            .apply('name')
            .apply('code');

          _this.refresh();

        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editVendor(row.entity)"><i class="fa fa-pencil"></i></a>',

      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeVendor(row.entity, $index)"><i class="fa fa-trash"></i></a>',

      })
      .addColumn('name', 'Name')
      .addColumn('code', 'Code', {width: 100})
      .options();

    /**
     * Initiates dialog for vendor edit.
     */
    $scope.editVendor = _this.editVendor = function (vendor) {
      $uibModal.open({
        templateUrl: 'app/vendors/edit/vendor-edit.html',
        controller: 'VendorEditCtrl',
        resolve: {
          vendor: function () {
            return vendor;
          }
        }
      }).result.then(function (vendorUpdated) {
        vendor = vendorUpdated;
        $lcmAlert.success('Vendor data has been updated');
      });
    };

    /**
     * Initiates vendor remove.
     */
    $scope.removeVendor = _this.removeVendor = function (vendor, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this vendor?'
      }).result.then(function () {
        //grid.data.splice(index, 1);
        Vendor.destroy(vendor.id);
      });
    };


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.vendorQuery.limit = _this.pager.size;
        _this.vendorQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.vendorQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };


    /**
     * Opens add vendor dialog
     */
    _this.newVendor = function () {

      $uibModal.open({
        templateUrl: 'app/vendors/new/vendor-new.html',
        controller: 'VendorNewCtrl'
      }).result.then(function (vendor) {
        grid.data.push(vendor);
        $lcmAlert.success('Vendor has been created');
      });

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.vendorQuery.where = {};
      _this.vendorsGridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.vendorsGridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {

      _this.vendorQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Vendor.findAll({filter: JSON.stringify(_this.vendorQuery)})
        .then(function (data) {
          _this.pager.total = data.$total;
          grid.data = data;
          return data;
        });
    };

    _this.refresh();
  });
