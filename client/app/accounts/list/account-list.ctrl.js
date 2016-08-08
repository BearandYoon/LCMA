'use strict';

angular.module('lcma')
  .controller('AccountsCtrl', function ($scope, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, invoiceService, Account) {

    $lcmaPage.setTitle('Account List');

    var _this = this;

    /**
     * Holds grid settings
     * @type {settings}
     */
    var grid = _this.accountsGrid = $lcmaGrid({
      exporterCsvFilename: 'invoices.csv',
      onRegisterApi: function (api) {
        _this.accountsGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.accountQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.accountQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();

        });
      }
    })
      .addColumn('id', 'UniqueID')
      .addColumn('status.value', 'Status')

      .addColumn('account_no', 'Account', {
        pinnedLeft: true,
        cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.accountDetails({id: row.entity.id})">{{row.entity.account_no}}</a>',
      })
      .addColumn('vendor', 'Vendor', {width: 120})
      .addColumn('ap_vend_id', 'AP Vendor ID', {width: 120})
      .addNumberColumn('billing_cycle', 'Billing Cycle')
      .addColumn('vendor_alias', 'Vendor Alias', {width: 100})
      .addColumn('late_bill_log_days', 'Late Bill Log', {width: 100})
      .options();


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.accountQuery.limit = _this.pager.size;
        _this.accountQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.accountQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };


    /**
     * Opens add account dialog
     */
    _this.newAccount = function () {

      $uibModal.open({
        templateUrl: 'app/accounts/new/account-new.html',
        controller: 'AccountNewCtrl'
      }).result.then(function (account) {
        grid.data.push(account);
        $lcmAlert.success('Account has been created');
      }, function () {


      });

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.accountQuery.where = {};
      _this.accountsGridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.accountsGridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {
      _this.accountQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Account.findAll({filter: JSON.stringify(_this.accountQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
          return data;
        });
    };

    _this.refresh();
  });
