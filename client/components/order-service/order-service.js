/**
 *
 */
(function () {
    'use strict';

  function OrderServiceFormDirective(OrderService) {

    return {
      restrict: 'EA',
      replace:true,
      scope: {
        service: '=ngModel'
      },
      templateUrl: function (elem, attrs) {
        return 'components/order-service/order-service-circuit.html';
      },
      controller: function ($scope, $lcmaGrid, $lcmAlert) {

        $scope.serviceFlowScheme = [
          {key: 1, name: 'Vendor Ask'},
          {key: 2, name: 'FOC Received'},
          {key: 3, name: 'Rev FOC'},
          {key: 4, name: 'INnstalled'},
          {key: 5, name: 'Accepted'}

        ];

        var serviceSitesGrid = $scope.serviceSitesGrid = $lcmaGrid({
          enableFiltering: false,
          enableSorting: false,
          onRegisterApi: function (api) {
          }

        })
/*          .addCommandColumn('remove', 'remove', {
            cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeSite(row.entity, $index)"><i class="fa fa-trash"></i></a>',
          })*/
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

        serviceSitesGrid.data = $scope.service.sites;

        $scope.saveService = function (form) {
          var service = $scope.service;
          OrderService.update(service.id, service).then(function () {
            $lcmAlert.success('Service updates successfully');
          });
        };

        $scope.addServiceSite = function (site) {
          $scope.service.sites = $scope.service.sites || [];
          $scope.service.sites.push(site);
          serviceSitesGrid.data = $scope.service.sites;
        }

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaOrderServiceForm', OrderServiceFormDirective);


}());
