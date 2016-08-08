/**
 *
 */
(function () {
  'use strict';

  function ContactsCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, Contact) {

    $lcmaPage.setTitle('Contact List');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'contacts.csv',
      onRegisterApi: function (api) {
        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.contactQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });
          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {
          $lcmaGridFilter(this.grid, _this.contactQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));
          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editContact(row.entity)"><i class="fa fa-pencil"></i></a>'
      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeContact(row.entity, $index)"><i class="fa fa-trash"></i></a>'
      })
      .addColumn('id', 'Contact #')
      .addColumn('first_name', 'First Name')
      .addColumn('last_name', 'Last Name')
      .addColumn('title', 'Title')
      .addColumn('function', 'Function')
      .addColumn('company', 'Company')
      .addColumn('city', 'City')
      .addColumn('state', 'State')
      .options();

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.contactQuery.limit = _this.pager.size;
        _this.contactQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds contacts query.
     */
    _this.contactQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Opens add contact dialog
     */
    _this.addContact = function () {
      $uibModal.open({
        templateUrl: 'app/contacts/new/contact-new.html',
        controller: 'ContactNewCtrl'
      }).result.then(function (contact) {
          grid.data.push(contact);
          $lcmAlert.success('New contact has been created.');
        });
    };

    /**
     * Opens edit contact dialog
     */
    $scope.editContact = _this.editContact = function (contact) {
      $uibModal.open({
        templateUrl: 'app/contacts/edit/contact-edit.html',
        controller: 'ContactEditCtrl',
        resolve: {
          $currentContact: function () {
            return contact;
          }
        }
      }).result.then(function (data) {
          angular.extend(contact, data);
          $lcmAlert.success('Contact info has been updated.');
        });
    };

    /**
     * Initiates Contact remove.
     */
    $scope.removeContact = _this.removeContact = function (contact, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Contact?'
      }).result.then(function () {
          //grid.data.splice(index, 1);
          Contact.destroy(contact.id);
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
      Contact.findAll({filter: JSON.stringify(_this.contactQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };

    _this.refresh();
  }

  angular.module('lcma')
    .controller('ContactsCtrl', ContactsCtrl);
}());
