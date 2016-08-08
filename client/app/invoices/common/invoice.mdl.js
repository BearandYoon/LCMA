(function () {
  'use strict';

  angular.module('lcma')
    .factory('Invoice', function (DS) {

      return DS.defineResource({
        name: 'invoice',
        computed: {
          tot_amt: ['tot_amt_due', 'tot_usage_chgs', function (amt, chgs) {
            return parseFloat(amt) + parseFloat(chgs);
          }],
          total: ['tot_amt', 'amount_witheld', function (amt, wh) {
            return parseFloat(amt) - parseFloat(wh);
          }],
          sp_vendor_logo_url: ['sp_name', function (name) {
            return name ?  '/assets/img/vendor/' + name.toLowerCase() + '.png' : name;
          }]
        },
        actions: {
          stat: {
            method: 'GET'
          }
        }
      });
    });

}());
