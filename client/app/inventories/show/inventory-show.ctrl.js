'use strict';

angular.module('lcma')
  .controller('InventoryShowCtrl', function ($scope, $state, $lcmAlert, $lcmaDialog, $stateParams, $lcmaGrid, $lcmaPage,
                                             $uibModal, Inventory, Vendor, Contract, Note, Site, Dictionary) {

    $lcmaPage.setTitle('Inventory');

    var _this = this;

    _this.editing = false;

    //Inventory notes
    _this.notes = [];

    //inventory sites
    _this.sites = [];
    _this.topologies = [];

    /**
     * Holds disputes grid api
     */
    _this.sitesGrid = $lcmaGrid({
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableSorting: false,
      enableFiltering: false
    })
    .addCommandColumn('edit', 'Edit', {
      cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editContractDocument(row.entity)"><i class="fa fa-pencil"></i></a>'

    })
    .addCommandColumn('remove', 'remove', {
      cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeContractDocument(row.entity, $index)"><i class="fa fa-trash"></i></a>'

    })
    .addColumn('id', 'Node ID')
    .addColumn('site_id', 'Site ID')
    .addColumn('floor', 'Floor')
    .addColumn('room', 'Room')
    .addColumn('type.value', 'Site Type')
    .addColumn('address1', 'Addr1')
    .addColumn('address2', 'Addr2')
    .addColumn('address3', 'Addr3')
    .addColumn('city', 'City')
    .addColumn('state', 'State')
    .addColumn('zip', 'Zip')
    .options()
    ;


    /**
     * Initiates disable/enable settings
     */
    _this.editInventory = function () {
      _this.editing = !_this.editing;
    };

    // save inventory
    _this.saveInventory = function (form) {
      if (!form.$valid) {
        return;
      }

      if (_this.inventory.id) {
        Inventory.update(_this.inventory.id, _this.inventory)
          .then(function (data) {

            _this.editing = false;
            _this.inventory = data;
          });
      }
      else {
        Inventory.create(_this.inventory)
          .then(function (data) {
            console.log(data);
            _this.editing = false;
            _this.inventory = data;
          });
      }

    };

    /**
     * Queries charges against query.
     */
    _this.query = function () {
      if ($stateParams['id']) {
        return Inventory.find($stateParams['id']).then(function (inventory) {

          _this.inventory = inventory;

          _this.sitesGrid.data = _this.inventory.sites;

          // Get notes for the inventory
          _this.notesQuery = {
            where: {
              entity_id: {'==': inventory.id},
              entity_type: {'==': 'inventory'}
            }
          };

          Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
            _this.notes = notes;
          });


          // Get Topology Value
          Dictionary.getDictionary('inventory-topology').then(function (topologies) {
            _this.topologies = topologies;
          });

          $lcmaPage.setTitle('Inventory ID: ' + _this.inventory.id);

        });
      }
      else {
        _this.inventory = {};
      }
    };

    /**
     * Opens add note dialog
     */
    _this.addNote = function () {

      $uibModal.open({
        templateUrl: 'app/note/new/note-new.html',
        controller: 'NoteNewCtrl',
        size: 'lg',
        resolve: {
          entityId: function () {
            return _this.inventory.id
          },
          entityType: function () {
            return 'inventory'
          },
          charges: function () {
            return [];
          }
        }
      })
      .result.then(function (newNote) {
        _this.notes.push(newNote);
        $lcmAlert.success('Note has been created');
      }, function () {


      });
    };

    /**
     * Opens add Site dialog
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

    /**
    * Sends reply to note.
    * @param note
    */
    _this.onNoteReply = function (note) {
      Note.create({
        entity_id: _this.inventory.id,
        parent_id: note.id,
        entity_type: 'inventory',
        content: note.$reply.content
      }).then(function (newNote) {
        delete note.$reply;

        if (!note.notes) {
          note.notes = [];
        }
        note.notes.push(newNote);
      });
    };

    /**
     * get topology:dictinary object based on key
     */
    _this.getTopology = function(key) {

      return _.find(_this.topologies, function(ele) {
        if (false === ele.use_custom_key && key === ele.id) {
          return true;
        }
        else if (true === ele.use_custom_key && key === ele.custom_key) {
          return true;
        }
        return false;
      });
    };

    _this.query();

  });
