/**
 *
 */
(function () {
  'use strict';

  function OrderEditCtrl($scope, $lcmaPage, $lcmAlert, $currentOrder, $lcmaDialog, $lcmaGrid, Order, OrderService) {
    $lcmaPage.setTitle('New Order');

    var _this = this;

    var order = _this.order = angular.copy($currentOrder);

    _this.services = [];

    /**
     * Holds grid settings
     * @type {settings}
     */
/*    var servicesGrid = _this.servicesGrid = $lcmaGrid({
      exporterCsvFilename: 'invoices.csv',
      enableFiltering: false,

      onRegisterApi: function (api) {
        _this.servicesGridApi = api;
      }
    })
    /!*      .addCommandColumn('edit', 'Edit', {
     cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editOrder({id: row.entity.id})"><i class="fa fa-pencil"></i></a>'
     })*!/
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeService(row.entity, $index)"><i class="fa fa-trash"></i></a>'
      })
      .addColumn('id', 'Service #')
      .addColumn('type', 'Type')
      .addColumn('topology', 'Topology')
      .addDateColumn('ack_date', 'Ack Date')
      .options();

    servicesGrid.data = _this.order.services;*/

    _this.saveOrder = function (form) {

      form.$setSubmitted();

      if (!form.$valid) {
        return;
      }

      Order.update(order.id, order).then(function (order) {
        $lcmAlert.success('Order has been updated successfully.');
      })

    };

    var serviceSitesGrid = _this.serviceSitesGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeSite(row.entity, $index)"><i class="fa fa-trash"></i></a>',
      })
      .addColumn('id', 'Site #')
      .addColumn('site_id', 'Site ID', {
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.site_id}}</div>'
      })
      .addColumn('vendor.name', 'Vendor')
      .addColumn('building.name', 'Building')
      .addColumn('type.value', 'Site Type')
      .addColumn('address1', 'Address1')
      .addColumn('address2', 'Address2')
      .addColumn('address3', 'Address3')
      .addColumn('city_state_zip', 'City/State/Zip', {
        enableFiltering: true,
        width: 180,
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.city}}, {{row.entity.state}}, {{row.entity.zip}}</div>'
      })
      .options();




    _this.appendService = function (type) {
      _this.service = {
        type: type,
        order_id: order.id,
        topology: 'P2P',
        sites: []
      };
    };

    _this.discardNewService = function () {
      _this.service = null;
    };

    /**
     * Initiates order removal.
     * @type {$scope.removeService}
     */
    _this.removeService = $scope.removeService = function (service, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Service?'
      }).result.then(function () {
        OrderService.destroy(service.id);
        _this.order.services.splice(index, 1);
      });
    };

    _this.addNewService = function (form) {

      /*form.$setSubmitted();

       if(!form.$valid) {
       return;
       }*/

      OrderService.create(_this.service).then(function (service) {

        _this.order.services = _this.order.services || [];
        _this.order.services.push(service);
        _this.service = null;
        $lcmAlert.success('Order service has been created successfully.');
      })

    };

    _this.addServiceSite = function (site) {
      _this.service.sites.push(site);
      serviceSitesGrid.data = _this.service.sites;
    }
  }

  angular.module('lcma')
    .controller('OrderEditCtrl', OrderEditCtrl)

}());
