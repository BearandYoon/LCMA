/**
 * Created by bear on 2/22/16.
 */
(function () {
  'use strict';

  function EquipmentsCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, Equipment) {

    $lcmaPage.setTitle('Equipment List');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'equipments.csv',
      onRegisterApi: function (api) {
        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.equipmentQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });
          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {
          $lcmaGridFilter(this.grid, _this.equipmentQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));
          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editEquipment(row.entity)"><i class="fa fa-pencil"></i></a>'
      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeEquipment(row.entity, $index)"><i class="fa fa-trash"></i></a>'
      })
      .addColumn('id', 'Equipment #')
      .addColumn('equip_type', 'Equipment Type')
      .addColumn('equip_maker', 'Equipment Maker')
      .addColumn('equip_model', 'Equipment Model')
      .addColumn('site_name', 'Site Name')
      .addColumn('building_name', 'Building Name')
      .addColumn('building_address', 'Building Address')
      .addColumn('building_city', 'Building City')
      .addColumn('building_state', 'Building State')
      .addColumn('building_zip', 'Building Zip')
      .options();

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.equipmentQuery.limit = _this.pager.size;
        _this.equipmentQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds contacts query.
     */
    _this.equipmentQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Opens add equipment dialog
     */
    _this.addEquipment = function () {
      $uibModal.open({
        templateUrl: 'app/equipments/new/equipment-new.html',
        controller: 'EquipmentNewCtrl'
      }).result.then(function (equipment) {
          grid.data.push(equipment);
          $lcmAlert.success('New equipment has been created.');
        });
    };

    /**
     * Opens edit equipment dialog
     */
    $scope.editEquipment = _this.editEquipment = function (equipment) {
      $uibModal.open({
        templateUrl: 'app/equipments/edit/equipment-edit.html',
        controller: 'EquipmentEditCtrl',
        resolve: {
          $currentEquipment: function () {
            return equipment;
          }
        }
      }).result.then(function (data) {
          angular.extend(equipment, data);
          $lcmAlert.success('Equipment info has been updated.');
        });
    };

    /**
     * Initiates Equipment remove.
     */
    $scope.removeEquipment = _this.removeEquipment = function (equipment, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Equipment?'
      }).result.then(function () {
          Equipment.destroy(equipment.id);
        });
    };

    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    _this.refresh = function () {
      Equipment.findAll({filter: JSON.stringify(_this.equipmentQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };

    _this.refresh();
  }

  angular.module('lcma')
    .controller('EquipmentsCtrl', EquipmentsCtrl);
}());
