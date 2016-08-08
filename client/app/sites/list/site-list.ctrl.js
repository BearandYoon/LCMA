/**
 *
 */
(function () {
    'use strict';

  function SitesCtrl($scope, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Site) {

    $lcmaPage.setTitle('Site List');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'sites.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.siteQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.siteQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }

    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editSite(row.entity)"><i class="fa fa-pencil"></i></a>',
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

    /**
     * Initiates Site remove.
     */
    $scope.removeSite = _this.removeSite = function (site, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Site?'
      }).result.then(function () {
        Site.destroy(site.id);
      });
    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.siteQuery.limit = _this.pager.size;
        _this.siteQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds sites query.
     */
    _this.siteQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Opens add site dialog
     */
    _this.addSite = function () {

      $uibModal.open({
        templateUrl: 'app/sites/new/site-new.html',
        controller: 'SiteNewCtrl'
      }).result.then(function (site) {
        grid.data.push(site);
        $lcmAlert.success('New site has been created.');
      });

    };

    /**
     * Opens add site dialog
     */
    $scope.editSite = _this.editSite = function (site) {

      $uibModal.open({
        templateUrl: 'app/sites/edit/site-edit.html',
        controller: 'SiteEditCtrl',
        resolve: {
          $currentSite: function () {
            return site;
          }
        }
      }).result.then(function (data) {
        angular.extend(site, data);
        $lcmAlert.success('Site info has been updated.');
      });

    };


    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.siteQuery.where = {};
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

    _this.refresh = function () {

      _this.siteQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      Site.findAll({filter: JSON.stringify(_this.siteQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });

    };

    _this.refresh();

  }

  angular.module('lcma')
    .controller('SitesCtrl', SitesCtrl);


}());
