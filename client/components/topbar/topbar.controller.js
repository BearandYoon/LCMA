'use strict';

angular.module('lcma')
  .controller('TopbarCtrl', function ($scope) {

    //$broadcast.emit('lhs:toggle');

    $scope.toggleSidebar = function () {
      angular.element('body').toggleClass('sidebar-min');
    };

  });
