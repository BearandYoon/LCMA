/**
 *
 */
(function () {
  'use strict';
  /**
   * display site detail vertically
   * @param site
   * @constructor
   */

  function SiteInfoDirective() {

    return {
      restrict: 'EA',
      scope: {
        siteId: '=',
        site: '=?',
        editing: '=',
        preview: '='
      },
      templateUrl: 'components/site/site-detail.html',
      controller: function ($scope, $uibModal, $lcmAlert, Site) {
        $scope.site = null;
        $scope.selection = {value: null};

        Site.findAll().then(function (sites) {
          $scope.sites = sites;

          if ($scope.siteId) {
            $scope.site = _.find($scope.sites, {id: $scope.siteId});
            $scope.selection.value=$scope.site;
          }

        });

        // Handles site list change event
        $scope.onSelect = function (site) {

          $scope.site = site;
          $scope.siteId = site.id;
          //$scope.selection = site;

        };

        //show bootstrap dialog search modal
        $scope.searchSite = function () {

          var dlg = $uibModal.open({
            templateUrl: 'components/site/site-search.html',
            //windowClass: 'site-search-modal',
            controller: "SiteSearchCtrl",
            controllerAs: 'ctx'

          });

          /**
           * Initialize Variables
           */

          dlg.result.then(function (site) {

            $scope.site = site;
            $scope.siteId = $scope.site.id;
            $scope.selection.value=$scope.site;

          }, function (reason) {
            console.log('dismissed');
          });
        };

        /**
         * Opens add site dialog
         */
        $scope.addSite = function () {

          $uibModal.open({
            templateUrl: 'app/sites/new/site-new.html',
            controller: 'SiteNewCtrl'
          }).result.then(function (site) {
            $scope.sites.push(site);
            $lcmAlert.success('New site has been created.');
          });

        };


      }
    };

  }

  function SitePickerDirective(Site, $uibModal) {

    return {
      restrict: 'EA',
      replace: true,
      require: ['ngModel', 'ngDisabled'],
      template: function (elem, attrs) {
        return '<div class="input-group"><select name="' + attrs.name + '" ng-model="' + attrs.ngModel + '" class="form-control" ng-options="site as site.site_id for site in sites"></select><span class="input-group-addon" ng-click="addSite()"><i class="fa fa-plus"></i></span><span class="input-group-addon" ng-click="searchSite()"><i class="fa fa-search"></i></span></div>'
      },
      controller: function ($scope) {

        Site.findAll().then(function (sites) {
          $scope.sites = sites;
        });

        $scope.addSite = function () {

          $uibModal.open({
            templateUrl: 'app/sites/new/site-new.html',
            controller: 'SiteNewCtrl',
            size: 'lg'
          }).result.then(function (site) {
            $scope.sites.push(site);
            $lcmAlert.success('New site has been created.');
          });

        };
      }
    };

  }

  function SiteSearchCtrl($scope, $uibModalInstance, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Site) {

    var _this = this;

    // Close Modal
    _this.close = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _this.ok = function () {

      var selSites = _this.gridApi.selection.getSelectedRows();

      if (selSites && selSites.length > 0) {
        $uibModalInstance.close(selSites[0]);
      }
      else {
        $uibModalInstance.dismiss('cancel');
      }

    };


    var grid = _this.gridOptions = $lcmaGrid({


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
      },
      multiSelect: false

    })
      .addColumn('id', 'Site #')
      .addColumn('site_id', 'Site ID', {
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.site_id}}</div>'
      })
      .addColumn('site.name', 'Site')
      .addColumn('building.name', 'Building')
      .addColumn('site_type', 'Site Type')
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
    .directive('lcmaSiteDetail', SiteInfoDirective)
    .directive('lcmaSitePicker', SitePickerDirective)
    .controller('SiteSearchCtrl', SiteSearchCtrl)
  ;


}());
