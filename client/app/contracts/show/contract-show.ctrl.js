'use strict';

angular.module('lcma')
  .controller('ContractShowCtrl', function ($scope, $state, $lcmAlert, $lcmaDialog, $stateParams, $lcmaGrid, $lcmaPage, $uibModal, Contract, ContractSection, Document, Note, History) {

    $lcmaPage.setTitle('Contract');

    var _this = this;


    /**
     * Holds list of contract sections.
     */
    _this.sections = [];

    /**
     * Holds list of contract documents.
     */
    _this.documents = [];

    /**
     * Holds list of contract notes.
     */
    _this.notes = [];

    /**
     * Holds disputes grid api
     */
    _this.sectionsGrid = $lcmaGrid({

      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableSorting: false,
      enableFiltering: false
    })

      .addCommandColumn('edit', 'Edit', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editContractSection(row.entity)"><i class="fa fa-pencil"></i></a>'

      })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeContractSection(row.entity, $index)"><i class="fa fa-trash"></i></a>'

      })
      .addColumn('name', 'Name', {width: 200})
      .addColumn('key', 'Section ID')
      .addDateColumn('text', 'Contract Text', {
        width: 300,
        cellTemplate: '<div class="ui-grid-cell-contents"  uib-popover="{{row.entity.text}}" popover-trigger="mouseenter" popover-append-to-body="true">{{row.entity.text}}</div>'
      })
      .addDateColumn('abstract', 'Abstract', {
        width: 300,
        cellTemplate: '<div class="ui-grid-cell-contents" uib-popover="{{row.entity.abstract}}" popover-trigger="mouseenter" popover-append-to-body="true">{{row.entity.abstract}}</div>'

      })
      .options()
    ;

    /**
     * Holds disputes grid api
     */
    _this.documentsGrid = $lcmaGrid({

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
      .addColumn('path', 'Path', {width: 400})
      .addColumn('type', 'Type')
      .options()
    ;

    /**
     * Initiates contract edit dialog
     */
    _this.editContract = function () {
      $uibModal.open({
        templateUrl: 'app/contracts/edit/contract-edit.html',
        controller: 'ContractEditCtrl',
        size: 'lg',
        resolve: {
          $currentContract: function () {
            return _this.contract;
          }
        }
      }).result.then(function (data) {
        angular.extend(_this.contract, data);
        $lcmAlert.success('Contract info has been updated');
      });
    };

    /**
     * Initiates contract section edit dialog
     */
    $scope.editContractSection = _this.editContractSection = function (section) {
      $uibModal.open({
        templateUrl: 'app/contracts/section-edit/section-edit.html',
        controller: 'ContractSectionEditCtrl',
        resolve: {
          $currentSection: function () {
            return section;
          }
        }
      }).result.then(function (data) {
        angular.extend(section, data);
        $lcmAlert.success('Contract section info has been updated');
      });
    };

    /**
     * Initiates delte contract section dialog.
     * @param section
     */
    $scope.removeContractSection = function (section) {

      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this contract section?'
      }).result.then(function () {
        ContractSection.destroy(section.id, {params: {contract_id: section.contract_id}});
      });
    };

    _this.readDocument = function () {
      console.log(Contract);

      Contract.getAdapter('http').GET('/api/contract/' + _this.contract.id + '/document', {
          responseType: 'arraybuffer'
        })
        .then(function (response) {
          var blob = new Blob([response.data], {type: "application/pdf"});
          var objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl);
        });
      //Contract.document({params: {id: _this.contract.id}});
    };


    /**
     * Initiates contract add document dialog
     */
    _this.setDocument = function () {
      $uibModal.open({
        templateUrl: 'app/contracts/document-manager/document-manager.html',
        controller: 'ContractDocumentManagerCtrl',
        resolve: {
          $currentContract: function () {
            return _this.contract;
          },
          $settings: function () {
            return {};
          }
        }
      }).result.then(function (data) {
        angular.extend(_this.contract, data);
        $lcmAlert.success('Contract document has been updated');
      });
    };


    /**
     * Initiates contract add document dialog
     */
    _this.addDocument = function () {
      $uibModal.open({
        templateUrl: 'app/contracts/document-manager/document-manager.html',
        controller: 'EntityDocumentManagerCtrl',
        resolve: {
          $entity: function () {
            return _this.contract;
          },
          $settings: function () {
            return {};
          },
          $document: function () {
            return null;
          }
        }
      }).result.then(function (data) {
        _this.documents.push(data);
        $lcmAlert.success('Contract document has been added');
      });
    };


    /**
     * Initiates contract add document dialog
     */
    $scope.editContractDocument = _this.editDocument = function (document) {
      $uibModal.open({
        templateUrl: 'app/contracts/document-manager/document-manager.html',
        controller: 'EntityDocumentManagerCtrl',
        resolve: {
          $entity: function () {
            return _this.contract;
          },
          $settings: function () {
            return {};
          },
          $document: function () {
            return document;
          }
        }
      }).result.then(function (data) {
        angular.extend(document, data);
        $lcmAlert.success('Contract document has been updated');
      });
    };

    /**
     * Initiates contract document removal.
     * @param doc
     */
    $scope.removeContractDocument = function (doc) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this document?'
      }).result.then(function () {
        Document.destroy(doc.id);
      });
    };

    /**
     * Initiates contract section create dialog
     */
    _this.addContractSection = function () {
      $uibModal.open({
        templateUrl: 'app/contracts/section-new/section-new.html',
        controller: 'ContractSectionNewCtrl',
        resolve: {
          $currentContract: function () {
            return _this.contract;
          }
        }
      }).result.then(function (data) {
        _this.sections.push(data);
        $lcmAlert.success('Contract section has been added');
      });
    };


    /**
     * Activate related items tab
     * @param tab
     */
    _this.activateRelatedTab = function (tab) {
      _this.relatedTabs = {active: tab};
    };

    _this.activateRelatedTab('documents');

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
            return _this.contract.id
          },
          entityType: function () {
            return 'contract'
          },
          charges: function () {
            return [];
          }
        }
      }).result.then(function (newNote) {
        _this.notes.push(newNote);
        $lcmAlert.success('Note has been created');
      }, function () {


      });

    };

    /**
     * Sends reply to note.
     * @param note
     */
    _this.onNoteReply = function (note) {
      Note.create({
        entity_id: _this.contract.id,
        parent_id: note.id,
        entity_type: 'contract',
        content: note.$reply.content
      }).then(function (newNote) {
        delete note.$reply;
        note.notes.push(newNote);
      });
    };

    /**
     * Queries charges against query.
     */
    _this.query = function () {
      return Contract.find($stateParams['id']).then(function (contract) {
        _this.contract = contract;

        var sectionsQuery = {where: {contract_id: {'===': contract.id}}};
        ContractSection.findAll(sectionsQuery, {params: {contract_id: contract.id}}).then(function (sections) {
          _this.sections = sections;
          _this.sectionsGrid.data = _this.sections;

          Document.entity(_this.contract.id).then(function (response) {
            _this.documents = response.data;
            _this.documentsGrid.data = _this.documents;
          });

          // Get notes for the contract
          _this.notesQuery = {
            where: {
              entity_id: {'==': contract.id},
              entity_type: {'==': 'contract'}
            }
          };

          Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
            _this.notes = notes;
          });

          // Get history for the invoice
          _this.historyQuery = {
            where: {
              entity_id: {'==': contract.id}
            }
          };


          History.findAll({filter: JSON.stringify(_this.historyQuery)}).then(function (history) {
            _this.history = history;
          });
        });

        $lcmaPage.setTitle('Contract Doc ID: ' + _this.contract.id);

      });
    };

    _this.query();

  });
