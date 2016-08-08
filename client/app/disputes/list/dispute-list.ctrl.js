'use strict';

angular.module('lcma')
  .controller('DisputesCtrl', function ($scope, $location, $lcmAlert, $lcmaPage, $lcmaPager, $lcmaGrid, $lcmaGridFilter, $uibModal, uiGridConstants, Dispute) {

    $lcmaPage.setTitle('Dispute List');

    var _this = this;

    /**
     * Holds dispute status
     */
    _this.duisputeStatusValues = [
      {value: -1, label: 'All'},
      {value: 1, label: 'Filed'},
      {value: 2, label: 'Closed - Won'},
      {value: 3, label: 'Closed - Lost'}
    ];

    /**
     * Disputes grid definition
     */
    var grid = _this.gridOptions = $lcmaGrid({
      exporterCsvFilename: 'disputes.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.disputeQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.disputeQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });

      }

    })
      .addColumn('dispute_id', "Dispute ID", {
        width: 140,
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.viewDisputeDetails(row.entity.id)">{{row.entity.dispute_id || \'View\'}}</a>'
      })
      .addColumn('invoice.sp_name', "Vendor")
      // TODO: This need to be wording
      .addRelColumn('status', "Dispute Status", {
        cellFilter: 'lcmaDisputeStatus',
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: _this.duisputeStatusValues
        }
      })
      .addDateTimeColumn('disp_stat_dt', "Last Update")
      .addColumn('user.username', "Filed By")
      .addDateColumn('created_at', "Filed Date")
      .addDateColumn('category.name', "Dispute Category")
      .addCurrencyColumn('total_amount', "Total Charges")
      .addCurrencyColumn('calculated_amount', "Total Calculated Charges", {width: 140})
      .addCurrencyColumn('disputed_amount', "Total Dispute")
      .addCurrencyColumn('final_amount', "Final Charge")
      .addCurrencyColumn('final_dispute', "Final Dispute")
      .addCurrencyColumn('amount_withheld', "Amount Withheld")
      .options();

    /**
     * Opens view dispute dialog
     */
    $scope.viewDisputeDetails = _this.viewDispute = function (dispute_id) {

      $uibModal.open({
        templateUrl: 'app/disputes/edit/dispute-edit.html',
        controller: 'DisputeEditCtrl',
        size: 'vlg',
        resolve: {
          disputeId: function () {
            return dispute_id;
          }
        }
      });

    };


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.disputeQuery.limit = _this.pager.size;
        _this.disputeQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds invoice query.
     */
    _this.disputeQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.disputeQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
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

      _this.disputeQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Dispute.findAll({filter: JSON.stringify(_this.disputeQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;

          return data;
        });
    };

    _this.refresh();
  });
