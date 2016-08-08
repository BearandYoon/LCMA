'use strict';

angular.module('lcma')
  .controller('OrdersCtrl', function ($scope, $state, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, invoiceService, Order) {

    $lcmaPage.setTitle('Order List');

    var _this = this;

    /**
     * Holds grid settings
     * @type {settings}
     */
    var grid = _this.ordersGrid = $lcmaGrid({
      exporterCsvFilename: 'invoices.csv',
      onRegisterApi: function (api) {
        _this.ordersGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.orderQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.orderQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();

        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editOrder({id: row.entity.id})"><i class="fa fa-pencil"></i></a>'
      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeOrder(row.entity, $index)"><i class="fa fa-trash"></i></a>'
      })
      .addColumn('id', 'Order #')
      .addColumn('order_type.value', 'Order Type', {
        cellTemplate: '<div class="ui-grid-cell-contents" >Circuit</div>'
      })
      .addColumn('status.value', 'Status',{
      cellTemplate: '<div class="ui-grid-cell-contents" >New</div>'
    })

      .addDateColumn('request_date', 'Request Date')
      .addDateColumn('created_at', 'Create Date')
      .addDateColumn('send_date', 'Sent Date')
      .options();


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.orderQuery.limit = _this.pager.size;
        _this.orderQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.orderQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Initiates order edit.
     * @type {$scope.editOrder}
       */
    _this.editOrder = $scope.editOrder = function (order) {
      $state.go('app.orderEdit', {id: order.id})
    };

    /**
     * Initiates order removal.
     * @type {$scope.removeOrder}
       */
    _this.removeOrder = $scope.removeOrder = function (order, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Order?'
      }).result.then(function () {
        Order.destroy(order.id);
      });
    };


    /**
     * Opens add order dialog
     */
    _this.newOrder = function () {

      $state.go('app.orderNew', {id:null})

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.orderQuery.where = {};
      _this.ordersGridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.ordersGridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {

      _this.orderQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Order.findAll({filter: JSON.stringify(_this.orderQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
          return data;
        });
    };

    _this.refresh();
  });
