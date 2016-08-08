/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('DisputeEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, disputeId, Dispute, DisputeCategory) {

      /**
       * Disputes grid definition
       */
      var grid = $scope.chargesGrid = $lcmaGrid({
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableFiltering: false
      })

        .addColumn('charge.acct_level_1', "Account")
        .addColumn('charge.invoice.inv_date', "Invoice Date")
        .addColumn('charge.invoice.inv_num', "Invoice Num")
        .addColumn('status', "Status", {
          width: 100,
          cellFilter: 'lcmaDisputeStatus',
          //cellFilter: 'mapDisputeStatus',
          enableCellEdit: true,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          //TODO: Put this on the single place
          editDropdownOptionsArray: [
            {id: 1, value: 'Filed'},
            {id: 2, value: 'Closed - Won'},
            {id: 3, value: 'Closed - Lost'}
          ]
        })
        .addDateColumn('updated_at', "Last Update", {width: 80})
        .addDateColumn('chg_class', "Charge Type", {width: 80})
        .addColumn('charge.invoice.sp_serv_id', "Service ID")
        .addColumn('content', "Dispute Description", {enableCellEdit: true, width: 140})
        .addColumn('charge.chg_desc_1', "Charge Desc 1")
        .addColumn('charge.chg_desc_2', "Charge Desc 2")
        .addDateColumn('charge.beg_chg_date', "Beg Chg Date", {width: 80})
        .addDateColumn('charge.end_chg_date', "End Chg Date", {width: 80})
        .addNumberColumn('charge.chg_qty', 'Charge Qty')
        .addNumberColumn('charge.chg_rate', 'Charge Rate')
        .addCurrencyColumn('charge.chg_amt', 'Charge Amount')
        .addCurrencyColumn('calculated_amount', "Calculated Amount")
        .addCurrencyColumn('disputed_amount', "Dispute Amount", {enableCellEdit: true})
        .addCurrencyColumn('final_amount', "Final Charge", {enableCellEdit: true})
        .addCurrencyColumn('final_dispute', "Final Dispute")
        .addBooleanColumn('dispute_withheld', "Withheld", {
          width: 100,
          enableCellEdit: true,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          //TODO: Put this on the single place
          editDropdownOptionsArray: [
            {id: false, value: 'No'},
            {id: true, value: 'Yes'}
          ]
        })
        .options();


      /**
       * Collect all data.
       */
      $scope.query = function () {
        Dispute.find(disputeId).then(function (dispute) {

          $scope.dispute = dispute;

          grid.data = dispute.dispute_charges;
        });

        DisputeCategory.findAll().then(function (categories) {
          $scope.categories = categories;
        });
      };

      $scope.query();


      /**
       * Initiates update of dispute details.
       * @param form
       */
      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Dispute.update(disputeId, $scope.dispute).then(function (dispute) {
          $uibModalInstance.close(dispute);
        });


      };

      /**
       * Cancels all changes and closes the window
       */
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
