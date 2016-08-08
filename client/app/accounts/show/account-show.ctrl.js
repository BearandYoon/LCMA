'use strict';

angular.module('lcma')
  .controller('AccountShowCtrl', function ($scope, $state, $timeout, $lcmAlert, $stateParams, $lcmaGrid, $lcmaGridFilter, $lcmaPage, $lcmaDialog, $uibModal, Account, Invoice, invoiceService) {

    $lcmaPage.setTitle('Accounts');

    var _this = this;

    /**
     * Holds invoice query.
     */
    _this.invoiceQuery = {
      where: {}
    };

    /**
     * Holds invoice grid settings
     * @type {{}}
     */
    var invoicesGrid = _this.invoicesGrid = $lcmaGrid({
      exporterCsvFilename: 'invoices.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.invoiceQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refreshInvoices();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.invoiceQuery)
            .apply('sp_name')
            .apply('sp_inv_num')
            .apply('sp_acct_status_ind', 'status')
            .apply('tot_amt_due', 'currency')
            .apply('tot_occ_chgs', 'currency')
            .apply('inv_date', 'date')
            .apply('due_date', 'date')
            .apply('acct_level_1')
          ;

          _this.refreshInvoices();

        });
      }
    })
      .addColumn('sp_inv_num', 'Invoice Number', {
        width: 200,
        pinnedLeft: true,
        cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.invoiceDetails({id: row.entity.id})">{{row.entity.sp_inv_num}}</a>',
      })
      .addStatusColumn('sp_acct_status_ind', 'Status', {
        cellTemplate: '<div class="ui-grid-cell-contents"><lcma-invoice-status-view ng-model="row.entity.sp_acct_status_ind"></lcma-invoice-status-view></div>',
        filter: {
          term: -1,
          selectOptions: invoiceService.getFilters()
        }
      })
      .addColumn('sp_name', 'Vendor', {width: 120})
      .addColumn('acct_level_1', 'Account', {width: 100})
      .addDateColumn('inv_date', 'Invoice Date')
      .addDateColumn('due_date', 'Due Date')
      .addCurrencyColumn('tot_amt_due', 'Amount')
      .addCurrencyColumn('tot_occ_chgs', 'Current Charges')
      .options();

    /**
     * Initiates deletion of an account
     */
    _this.deleteAccount = function () {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this account?'
      }).result.then(function () {
        //grid.data.splice(index, 1);
        Account.destroy(_this.account.id);
        $state.go('app.accounts');
      });
    };


    /**
     * Opens add account dialog
     */
    _this.editAccount = function () {

      $uibModal.open({
        templateUrl: 'app/accounts/edit/account-edit.html',
        controller: 'AccountEditCtrl',
        resolve: {
          account: function () {
            return _this.account;
          }
        }
      }).result.then(function (acc) {
        angular.extend(_this.account, acc);
        $lcmAlert.success('Account has been updated');
      });

    };

    /**
     * Clears all invoice filters.
     */
    _this.clearInvoicesFilters = function () {
      _this.gridApi.core.clearAllFilters(true, true, true);
      __this.invoiceQuery = {
        where: {
          acct_level_1: {
            '===' : _this.account.account_no
          }
        }
      };

      _this.refreshInvoices();
    };

    /**
     * Queries account and related entities.
     */
    _this.query = function () {
      Account.find($stateParams['id']).then(function (account) {

        $lcmaPage.setTitle('Account: ' + account.account_no);

        _this.account = account;


        _this.invoiceQuery = {
          where: {
            acct_level_1: {
              '===' : _this.account.account_no
            }
          }
        };

        _this.refreshInvoices();
      });
    };

    /**
     * Refreshes list of account invoices.
     */
    _this.refreshInvoices = function () {
      Invoice.findAll({filter: JSON.stringify(_this.invoiceQuery)})
        .then(function (invoices) {
          invoicesGrid.data = invoices;
        })
    };


    _this.query();

  });
