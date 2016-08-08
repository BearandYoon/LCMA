/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('DisputeNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, invoiceId, charges, Dispute) {

      $scope.dispute = {};
      $scope.charges = charges;


      /**
       * Disputes grid definition
       */
      $scope.chargesGrid = $lcmaGrid({
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableFiltering: false,
        data: charges
      })

        .addColumn('acct_level_2', "Subaccount")
        .addColumn('chg_class', "Charge Type")
        .addColumn('chg_desc_1', "Charge Desc 1")
        .addDateColumn('beg_chg_date', "Install Date")
        .addColumn('status', "Status", {
          cellFilter: 'mapDisputeStatus',
          enableCellEdit: true,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownOptionsArray: [
            { id: 1, value: 'Filed' },
            { id: 2, value: 'Closed - Won' },
            { id: 3, value: 'Closed - Lost' }
          ]
        })
        .addColumn('description', "Dispute description", {enableCellEdit: true, width: 200})
        .addCurrencyColumn('disputed_amount', "Disputed Amt", {enableCellEdit: true, width: 100})
        .addCurrencyColumn('chg_amt', "Charge Amount")
        .options();


      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Dispute.create({
          invoice_id: invoiceId,
          content: $scope.note.content,
          charges: charges
        }).then(function (dispute) {
          $uibModalInstance.close(dispute);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    })
    .filter('mapDisputeStatus', function() {
      var statusHash = {
        1: 'Filed',
        2: 'Closed - Won',
        3: 'Closed - Loose'
      };

      return function(input) {
        if (!input){
          return '';
        } else {
          return statusHash[input];
        }
      };
    });


}());
