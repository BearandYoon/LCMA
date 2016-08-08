'use strict';

angular.module('lcma')
  .controller('ContractsCtrl', function ($scope, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $lcmaDialog, invoiceService, Contract) {

    $lcmaPage.setTitle('Contracts');

    var _this = this;

    _this.tree = {
      data: [],
      colDefs: [
        {field: 'name', displayName: ' ', cellTemplate: '<a ui-sref="app.contractDetails({id: row.branch[\'id\']})"><i class="fa fa-eye"></i></a>'},
        {field: 'company_name', displayName: 'Company'},
        //{field: 'company_sign_date', displayName: 'Company Signed', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'vendor', displayName: 'Vendor', cellTemplate: '<span>{{row.branch.vendor.name}}</span>'},
        //{field: 'vendor_sign_date', displayName: 'Vendor Signed', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'effective_date', displayName: 'Effective Date', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'termination_date', displayName: 'Termination Date', cellTemplate: '<span>{{row.branch[col.field] | lcmaDate}}</span>'},
        {field: 'term_months', displayName: 'Term'},
        {field: 'committed_value', displayName: 'Committed Value', cellTemplate: '<span>{{row.branch[col.field] | currency}}</span>'}

      ]
    };


    /**
     * Holds grid settings
     * @type {settings}
     */
    var grid = _this.contractsGrid = $lcmaGrid({
      exporterCsvFilename: 'contracts.csv',
      onRegisterApi: function (api) {
        _this.contractsGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.contractQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.contractQuery)
            .apply('name')
            .apply('company_name')
            .apply('company_sign_date', 'date')
            .apply('vendor.name')
            .apply('vendor_sign_date', 'date')
            .apply('effective_date', 'date')
            .apply('termination_date', 'date')
            .apply('term_months', 'number')
            .apply('committed_value', 'currency')
          ;

          _this.refresh();

        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editContract(row.entity)"><i class="fa fa-pencil"></i></a>',

      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeContract(row.entity, $index)"><i class="fa fa-trash"></i></a>',

      })
      .addColumn('name', 'Name', {
        cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.contractDetails({id: row.entity.id})">{{row.entity.name}}</a>'
      })
      .addColumn('company_name', 'Company')
      .addDateColumn('company_sign_date', 'Company Signed')
      .addColumn('vendor.name', 'Vendor')
      .addDateColumn('vendor_sign_date', 'Vendor Signed')
      .addDateColumn('effective_date', 'Effective Date')
      .addDateColumn('termination_date', 'Termination Date')
      .addNumberColumn('term_months', 'Term (months)')
      .addCurrencyColumn('committed_value', 'Committed Value')
      .options();

    /**
     * Initiates dialog for contract edit.
     */
    $scope.editContract = _this.editContract = function (contract) {
      $uibModal.open({
        templateUrl: 'app/contracts/edit/contract-edit.html',
        controller: 'ContractEditCtrl',
        size: 'lg',
        resolve: {
          $currentContract: function () {
            return contract;
          }
        }
      }).result.then(function (data) {
        angular.extend(contract, data);
        $lcmAlert.success('Contract info has been updated');
      });
    };

    /**
     * Initiates contract remove.
     */
    $scope.removeContract = _this.removeContract = function (contract, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this contract?'
      }).result.then(function () {
        //grid.data.splice(index, 1);
        Contract.destroy(contract.id);
      });
    };


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.contractQuery.limit = _this.pager.size;
        _this.contractQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.contractQuery = {
      where: {
        master_id: {'===' : null}
      },
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };


    /**
     * Opens add contract dialog
     */
    _this.newContract = function () {

      $uibModal.open({
        templateUrl: 'app/contracts/new/contract-new.html',
        controller: 'ContractNewCtrl',
        size: 'lg'
      }).result.then(function (contract) {
        grid.data.push(contract);
        $lcmAlert.success('Contract has been created');
      });

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.contractQuery.where = {};
      _this.contractsGridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.contractsGridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {
      _this.contractQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Contract.findAll({filter: JSON.stringify(_this.contractQuery)})
        .then(function (data) {
          /*grid.data = data;
          _this.pager.total = data.$total;*/
          _this.tree.data = data;
          return data;
        });
    };

    _this.refresh();
  });
