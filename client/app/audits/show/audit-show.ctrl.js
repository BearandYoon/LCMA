/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .controller('AuditShowCtrl', function ($scope, $stateParams, $lcmaPage, $uibModalInstance, Audit) {
      var _this = this;
      var id =  $stateParams.id;

      _this.close = function () {
        $uibModalInstance.dismiss('cancel');
      };

      _this.query = function () {
        Audit.find(id).then(function (audit) {
          _this.audit = audit;
        })
      };

      _this.query();
    });
}());
