/**
 *
 */
(function () {
    'use strict';

  function InventoryEditCtrl($scope, $lcmaPage, $lcmAlert, $lcmaGrid, Inventory, $currentInventory, Site, InventorySite) {
    $lcmaPage.setTitle('Edit Inventory');

    var _this = this;

    _this.inventory = $currentInventory;
    _this.selection =null;

    $lcmaPage.setTitle('Inventory: ' + _this.inventory.id);

    /**
     * Retrieve all sites
     */
    Site.findAll().then(function (sites) {
      _this.sites = sites;
    });

    var sitesGrid = _this.sitesGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeSite(row.entity)"><i class="fa fa-trash"></i></a>',
      })
/*      .addColumn('', '#', {
        cellTemplate: '<div class="ui-grid-filter-container">{{$index}}</div>'
      })*/
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

    _this.updateInventory = function (form) {

      form.$setSubmitted();

      if(!form.$valid) {
        return;
      }

      Inventory.update(_this.inventory.id, _this.inventory).then(function (inventory) {
        $lcmAlert.success('Inventory info has been updated');
      })

    };

    _this.addSite = function (site) {
      _this.inventory.sites = _this.inventory.sites || [];

      InventorySite.create(site, {params: {inventory_id: _this.inventory.id}})
        .then(function (inventorySite) {
          _this.inventory.sites.push(site);
          sitesGrid.data = _this.inventory.sites;
        });
    };

    _this.removeSite = $scope.removeSite = function (site) {

       _.remove(_this.inventory.sites, function(ele) {
        return ele.id ===site.id;
      });

    };

  }

  angular.module('lcma')
    .controller('InventoryEditCtrl', InventoryEditCtrl)

}());
