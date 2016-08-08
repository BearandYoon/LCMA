'use strict';

angular.module('lcma')
  .controller('InvoicesCtrl', function ($scope, $location, $lcmAlert, $lcmaPage, $lcmaPager, $lcmaGridFilter, invoiceService, Invoice) {

    $lcmaPage.setTitle('Invoice List');

    var _this = this;

    /**
     * Holds grid settings
     * @type {settings}
     */

/*    this.gridOptions = {
      columnDefs: {
        field: 'id'
      },
      rowData: []
    };*/

    var grid = invoiceService.listGridSettings({
      exporterCsvFilename: 'invoices.csv',
      flatEntityAccess: true,
      fastWatch: true,
      onReady: function(event) {
        event.api.sizeColumnsToFit();
      },
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.invoiceQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.invoiceQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));
          _this.refresh();

        });
      }

    }).options();

    this.gridOptions = grid;

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.invoiceQuery.limit = _this.pager.size;
        _this.invoiceQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * Holds invoice filters
     */
    _this.invoiceFilters = invoiceService.getFilters();

    /**
     * Holds invoice query.
     */
    _this.invoiceQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    $scope.$watchCollection(function () {
      return $location.search();
    }, function () {
      var qs = $location.search();
      if (qs.status) {
        _this.invoiceQuery.where.sp_acct_status_ind = {'==': qs.status};
      }
      else {
        delete _this.invoiceQuery.where.sp_acct_status_ind;
      }
      _this.refresh();
    });

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.invoiceQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };

    /**
     * Updates invoice status.
     * @param statusKey
     */
    _this.updateStatus = function (statusKey) {
      Invoice.updateAll(_this.gridApi.selection.getSelectedRows());
    };

    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {

      _this.invoiceQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Invoice.findAll({filter: JSON.stringify(_this.invoiceQuery)})
        .then(function (data) {
          grid.data = data;
/*          grid.api.setRowData(data);
          grid.api.refreshView();*/

          _this.pager.total = data.$total;

          return data;
        });
    };

    _this.refresh();
  });
