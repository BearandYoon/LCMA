'use strict';

angular.module('lcma')
  .controller('InvoiceShowCtrl', function ($scope, $state, $filter, $timeout, $lcmAlert, $stateParams, $lcmaGrid, $lcmaGridFilter, $lcmaPage, $lcmaPager, $lcmaFocus, $uibModal, invoiceService, uiGridConstants, Invoice, Charge, Note, Dispute, History) {

    $lcmaPage.setTitle('Invoice Detail');

    var _this = this;

    /**
     * Holds charge statuses
     */
    _this.chargeStatuses = [
      {value: -1, label: 'All'},
      {value: 'mrc', label: 'mrc'},
      {value: 'occ', label: 'occ'},
      {value: 'tax', label: 'tax/sur'},
      {value: 'adj', label: 'adj'},
      {value: 'disc', label: 'Discounts'},
      {value: 'usg', label: 'Usage'}
    ];

    _this.invoiceFlowScheme = [
      {key: 1, name: 'New'},
      {key: 2, name: 'New (Rejected)'},
      {key: 3, name: 'Ready for Approval'},
      {
        key: 4, name: 'Approve/Reject', actions: [
          {key: 'approve', name: 'Approve'},
          {key: 'reject', name: 'Reject'}
        ]
      },
      {key: 5, name: 'Output File Created'},
      {key: 6, name: 'Rev AP Feed Loaded'}

    ];

    /**
     * Holds info status
     */
    _this.infoIndicatorValues = [
      {value: -1, label: 'All'},
      {value: 'Y', label: 'Y'},
      {value: 'N', label: 'N'}
    ];

    /**
     * Holds list of invoice notes.
     */
    _this.notes = [];

    /**
     * Holds list of invoice disputes.
     */
    _this.disputes = [];


    /**
     * Holds charges filter query.
     */
    _this.chargesQuery = {};


    /**
     * Holds charges quick filter value.
     */
    _this.chargesQuickFilter = -1;

    /**
     * Holds notes filter query.
     */
    _this.notesQuery = {};

    /**
     * Holds disputes grid api
     */
    _this.disputesGrid = $lcmaGrid({

      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: true
    })

      .addColumn('id', 'ID')
      .addColumn('sp_name', 'Vendor')
      .addStatusColumn('status', 'Status')
      .addDateColumn('satus_date', 'Status Date')
      .addColumn('created_by_id', 'Filed By')
      .options()
    ;

    /**
     * Charges grid definition
     */
    var grid = _this.chargesGrid = $lcmaGrid({
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
      rowEquality: function (x, y) {
        return x.id === y.id;
      },
      onRegisterApi: function (api) {

        _this.chargesGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.chargesQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.queryCharges();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.chargesQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.queryCharges();

        });


        api.selection.on.rowSelectionChanged($scope, function (row) {

          var existingRow = findRowByEntityId(_this.chargesSelectionGrid.data, row.entity.id);

          if (row.isSelected && !existingRow) {
            _this.chargesSelectionGrid.data.push(row.entity);
            $timeout(function () {
              _this.chargesSelectionGridApi.selection.selectRow(row.entity);
            });

          }
          else if (!row.isSelected && existingRow) {
            _this.chargesSelectionGrid.data.splice(existingRow.index, 1);
          }

        });

      }
    })
      .addCommandColumn('charge_disputes', " ", {
        cellTemplate: '<div  ng-class="{\'text-muted\': !row.entity.charge_disputes.length, \'text-danger\': row.entity.charge_disputes.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewDispute(row.entity)"><i class="fa fa-warning font-lg"></i></div>'
      })
      .addCommandColumn('note_charges', "  ", {
        cellTemplate: '<div ng-class="{\'text-muted\': !row.entity.note_charges.length, \'text-info\': row.entity.note_charges.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewNotes(row.entity)"><i class="fa fa-comment font-lg"></i></div>'
      })
      .addColumn('acct_level_2', "Sub Account")
      .addRelColumn('chg_class', "Charge Type", {
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: _this.chargeStatuses
        }
      })
      .addColumn('sp_serv_id', "Service ID")
      .addColumn('chg_code_1', "Charge Code1")
      .addColumn('chg_desc_1', "Charge Description 1")
      .addColumn('chg_code_2', "Charge Code2")
      .addColumn('chg_desc_2', "Charge Description 2")
      .addNumberColumn('chg_qty1_billed', "Chg Qty")
      .addNumberColumn('chg_rate', "Charge Rate")
      .addCurrencyColumn('chg_amt', "Charge Amount")
      .addDateColumn('svc_establish_date', "Install Date")
      .addDateColumn('beg_chg_date', "Beg Charge Date")
      .addDateColumn('end_chg_date', "End Charge Date")
      .addRelColumn('info_only_ind', "Info Only Ind", {
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: _this.infoIndicatorValues
        }
      })
      .addColumn('fac_bw', "Facility Bandwidth")
      .addColumn('call_type', "Call Type")
      .addColumn('product_type', "Product Type")
      .addColumn('dir_ind', "Dir Ind")
      .addColumn('jur', "Jurisdiction")
      .addColumn('chg_qty1_type', "Chg Qty Type")
      .addColumn('chg_qty1_used', "Chg Qty Used")
      .addColumn('chg_qty1_allowed', "Chg Qty Allowed")

      .options();


    /**
     * Charges selection grid definition
     */
    _this.chargesSelectionGrid = $lcmaGrid({
      //data: _this.selectedCharges,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: false,
      rowEquality: function (x, y) {
        return x.id === y.id;
      },
      onRegisterApi: function (api) {

        _this.chargesSelectionGridApi = api;

        api.selection.on.rowSelectionChanged($scope, function (row) {
          if (!row.isSelected) {
            var existingRow = findRowByEntityId(_this.chargesSelectionGrid.data, row.entity.id);
            _this.chargesSelectionGrid.data.splice(existingRow.index, 1);
            _this.chargesGridApi.selection.unSelectRow(row.entity);
          }
        });

      }
    })
      .addCommandColumn('charge_disputes', " ", {
        cellTemplate: '<div  ng-class="{\'text-muted\': !row.entity.charge_disputes.length, \'text-danger\': row.entity.charge_disputes.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewDispute(row.entity)"><i class="fa fa-warning font-lg"></i></div>'
      })
      .addCommandColumn('note_charges', "  ", {
        cellTemplate: '<div ng-class="{\'text-muted\': !row.entity.note_charges.length, \'text-info\': row.entity.note_charges.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewNotes(row.entity)"><i class="fa fa-comment font-lg"></i></div>'
      })
      .addColumn('acct_level_2', "Subaccount")
      .addRelColumn('chg_class', "Charge Type", {
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: _this.chargeStatuses
        }
      })
      .addColumn('chg_desc_1', "Charge Desc 1")
      .addColumn('chg_desc_2', "Charge Desc 2")
      .addColumn('sp_serv_id', "SPID")
      .addDateColumn('beg_chg_date', "Install Date")
      .addColumn('address', "Service Address")
      .addCurrencyColumn('chg_amt', "Charge Amount")
      .options();

    /**
     * Disputes grid definition
     */
    _this.disputesGrid = $lcmaGrid({
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: false
    })
    //.addColumn('id', "ID")
      .addColumn('dispute_id', "Dispute ID", {
        width: 250,
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.viewDisputeDetails(row.entity.id)">{{row.entity.dispute_id || \'View\'}}</a>'
      })
      /*
       .addColumn('content', "Comment", {
       cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.disputeDetails({id: row.entity.id})">{{row.entity.content}}</a>'
       })*/
      .addDateColumn('user.username', "Filed By")
      .addDateColumn('created_at', "Filed At")
      .addCurrencyColumn('total_amount', "Charge Amount")
      .addCurrencyColumn('calculated_amount', "Calculated Amount", {width: 140})
      .addCurrencyColumn('disputed_amount', "Disputed Amount")
      .addCurrencyColumn('amount_withheld', "Amount Withheld")
      .options();


    function findRowByEntityId(list, id) {

      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].id === id) {
          return {item: list[i], index: i};
        }
      }
    }

    function restoreSelection(gridApi, selections) {

      angular.forEach(selections, function (row) {
        gridApi.selection.selectRow(row.entity);
      })
    }

    _this.onFlowAction = function (item, action) {
      alert(action);
    };

    /**
     * View dispute details
     * @param charge
     */
    $scope.viewDispute = function (charge) {

      _this.viewDispute(charge.charge_disputes[0].dispute_id);
      /*if (charge.charge_disputes.length) {
       $state.go('app.disputeDetails', {id: charge.charge_disputes[0].dispute_id});
       }*/
    };


    /**
     * View charge notes
     * @param charge
     */
    $scope.viewNotes = function (charge) {
      if (charge.note_charges.length) {
        _this.activateRelatedTab('notes');
        $lcmaFocus('note_' + charge.note_charges[0].note_id);
      }
    };

    /**
     * Clears all filters.
     */
    _this.clearChargesFilters = function () {
      _this.chargesQuery.where = {};
      _this.chargesGridApi.core.clearAllFilters(true, true, true);
      _this.queryCharges();
    };

    /**
     * Holds pager instance.
     */
    _this.ChargesPager = $lcmaPager({
      onGo: function () {
        _this.chargesQuery.limit = _this.ChargesPager.size;
        _this.chargesQuery.offset = _this.ChargesPager.from() - 1;
        _this.queryCharges();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.chargesQuery = {
      where: {},
      limit: _this.ChargesPager.size,
      offset: _this.ChargesPager.from() - 1
    };

    _this.activateHistoryTab = function() {
      _this.relatedTabs = {active: 'hostory'};
      _this.queryHistory();
    };

    _this.activateRelatedTab = function (tab) {
      _this.relatedTabs = {active: tab};
    };

    _this.activateRelatedTab('disputes');
    /**
     * Apply charges quick filter
     * @param status
     */
    _this.applyChargesQuickFilter = function (status) {
      _this.chargesQuickFilter = status;

      if (status === 'selection') {
        _this.chargesSelectionVisible = true;
        $timeout(function () {
          _this.chargesGridApi.core.refresh();
        }, 10);
      }
      else if (!status || status == -1) {
        _this.chargesSelectionVisible = false;
        delete _this.chargesQuery.where['chg_class'];
        _this.queryCharges();
      }
      else {
        _this.chargesSelectionVisible = false;

        // TODO: Investigate
        var value = {'==': status};

        if (status === 'tax') {
          value = {'in': ['tax', 'sur']}
        }

        else if (status === 'adj') {
          value = {'in': ['adjnc', 'adjbf', 'adjad']}
        }
        _this.chargesQuery.where['chg_class'] = value;
        _this.queryCharges();
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
            return _this.invoice.id
          },
          entityType: function () {
            return 'invoice'
          },
          charges: function () {
            return _this.chargesSelectionGrid.data
          }
        }
      }).result.then(function (newNote) {
        _this.notes.push(newNote);
        $lcmAlert.success('Note has been created');
      }, function () {

      });
    };


    /**
     * Opens add dispute dialog
     */
    _this.addDispute = function () {

      $uibModal.open({
        templateUrl: 'app/disputes/new/dispute-new.html',
        controller: 'DisputeNewCtrl',
        size: 'lg',
        resolve: {
          invoiceId: function () {
            return _this.invoice.id
          },
          charges: function () {
            return _this.chargesSelectionGrid.data
          }
        }
      }).result.then(function (newDispute) {
        _this.disputesGrid.data.push(newDispute);
        $lcmAlert.success('Dispute has been created');
      }, function () {

      });
    };

    /**
     * Opens view dispute dialog
     */
    $scope.viewDisputeDetails = _this.viewDispute = function (dispute_id) {

      $uibModal.open({
        templateUrl: 'app/disputes/edit/dispute-edit.html',
        controller: 'DisputeEditCtrl',
        size: 'vlg',
        resolve: {
          disputeId: function () {
            return dispute_id;
          }
        }
      }).result.then(function (newDispute) {
        $lcmAlert.success('Dispute has been updated');
      }, function () {

      });
    };

    /**
     * Sends reply to note.
     * @param note
     */
    _this.onNoteReply = function (note) {
      Note.create({
        entity_id: _this.invoice.id,
        parent_id: note.id,
        entity_type: 'invoice',
        content: note.$reply.content
      }).then(function (newNote) {
        delete note.$reply;
        note.notes.push(newNote);
      });
    };

    /**
     * Queries invoice and related entities.
     */
    _this.query = function () {
      Invoice.find($stateParams['id']).then(function (invoice) {

        $lcmaPage.setTitle('Invoice Detail: ' + invoice.sp_name + ' &#9679; ' + invoice.sp_inv_num + ' &#9679; ' + invoice.acct_level_1 + ' &#9679; ' + $filter('lcmaDate')(invoice.due_date));

        _this.invoice = invoice;

        // ensure there is at least 3 rows for contacts
        invoice.contacts = invoice.contacts || [];
        var min = 3;
        if (invoice.contacts.length < min) {
          var count = min - invoice.contacts.length;
          while (count > 0) {
            invoice.contacts.push({cont_type: 'N/A', dummy: true});
            count--;
          }
        }

        // Get charges for the invoice
        _this.chargesQuery = {
          where: {uniq_id: {'==': invoice.uniq_id}},
          limit: _this.ChargesPager.size,
          offset: _this.ChargesPager.from() - 1
        };
        _this.queryCharges();

        // Get notes for the invoice
        _this.notesQuery = {
          where: {
            entity_id: {'==': invoice.id},
            entity_type: {'==': 'invoice'}
          }
        };

        Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
          _this.notes = notes;
        });


        // Get disputes for the invoice
        _this.disputesQuery = {
          where: {
            invoice_id: {'==': invoice.id}
          }
        };

        Dispute.findAll({filter: JSON.stringify(_this.disputesQuery)}).then(function (disputes) {

          _this.invoice.amount_witheld = 0;
          angular.forEach(disputes, function (x) {

            var amt = parseFloat(x.amount_withheld);

            _this.invoice.amount_witheld += !isNaN(amt) ? amt : 0;
          });

          _this.disputesGrid.data = disputes;
        });

        // Get history for the invoice
        _this.historyQuery = {
          where: {
            //invoice_id: {'==': invoice.id}
          }
        };

        History.findAll({filter: JSON.stringify(_this.historyQuery)}).then(function (history) {
          _this.history = history;
        });

      });
    };

    /**
     * Queries charges against query.
     */
    _this.queryCharges = function () {
      Charge.findAll({filter: JSON.stringify(_this.chargesQuery)}).then(function (charges) {
        _this.chargesGrid.data = charges;
        _this.ChargesPager.total = charges.$total;
        $timeout(function () {
          restoreSelection(_this.chargesGridApi, _this.selectedCharges);
        }, 50);
      });
    };

    _this.queryHistory = function () {
      // Get history for the invoice
      _this.historyQuery = {
        where: {
//          id: {'==': invoice.id}
        }
      };

      History.findAll({filter: JSON.stringify(_this.historyQuery)}).then(function (history) {
        _this.history = history;
      });
    };

    this.query();
  });
