/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .service('invoiceService', function ($lcmaGrid, $filter, $uibModal, uiGridConstants) {

      function getFilters() {
        return [
          {value: -1, label: 'All'},
          {value: 0, label: 'Quarantined'},
          {value: 1, label: 'New'},
          {value: 2, label: 'Ready for Approval'},
          {value: 3, label: 'Approved'},
          {value: 4, label: 'GL Coded'}
        ];
      }


      /**
       * Opens new invoice dialog.
       * @param config
       * @returns {*}
       */
      function newInvoiceDialog(config) {

        var defaults = {
          templateUrl: 'app/invoices/new/invoices-new.html',
          controller: 'InvoiceNewCtrl',
          resolve: {}
        };

        var settings = angular.extend({}, defaults, config || {});

        return $uibModal.open(settings).result;
      }

      /**
       * Creates invoice detault grid settings
       * @param config
       * @returns {settings}
       */
      function listGridSettings(config) {

        return $lcmaGrid(config)
          .addColumn('sp_inv_num', 'Invoice Number', {
            width: 170,
            pinnedLeft: true,
            cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.invoiceDetails({id: row.entity.id})">{{row.entity.sp_inv_num}}</a>',
          })
          .addStatusColumn('inv_status', 'Status', {
            cellTemplate: '<div class="ui-grid-cell-contents"><lcma-invoice-status-view ng-model="row.entity.sp_acct_status_ind"></lcma-invoice-status-view></div>',
            filter: {
              term: -1,
              type: uiGridConstants.filter.SELECT,
              selectOptions: getFilters()
            }
          })
          .addColumn('sp_name', 'Vendor', {width: 120})
          .addColumn('acct_level_1', 'Account', {width: 170})
          .addDateColumn('date_issued', 'Invoice Date')
          .addDateColumn('due_date', 'Due Date')
          .addCurrencyColumn('tot_amt_due', 'Total Due')
          .addCurrencyColumn('tot_new_chgs', 'Total New Charges')
          .addCurrencyColumn('tot_new_chg_chg', 'New Charges Diff')
          .addNumberColumn('tot_new_chg_chg_pct', 'New Charges Diff %')
          .addCurrencyColumn('tot_mrc_chgs', 'Total MRC')
          .addCurrencyColumn('tot_occ_chgs', 'Total OCC')
          .addCurrencyColumn('tot_usage_chgs', 'Usage')
          .addCurrencyColumn('tot_taxusr', 'Total Taxes / Surcharge')
          .addCurrencyColumn('tot_disc_amt', 'Total Discounts')
          .addCurrencyColumn('tot_new_chg_adj', 'Tot Adjs New Chgs')
          .addCurrencyColumn('bal_fwd', 'Balance Forward')
          ;

      }

      return {
        listGridSettings: listGridSettings,
        newInvoiceDialog: newInvoiceDialog,
        getFilters: getFilters
      };


    });

}());
