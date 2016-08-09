/**
 *
 */
(function () {
  'use strict';


  function IfRoleDirective() {
    return {
      link: function (scope, elem, attrs) {

        //console.log(scope.$me);


        attrs.$observe('ifRole', function (val) {
          var me = scope.$me;
          console.log(me);
          var roles = me.roles.filter(function (x) {
            return x.name === val
          });
          if (!roles.length) {
            elem.hide();
          }
          else {
            elem.show();
          }
        });

      }
    }
  }

  function RoleProvider() {

    this.$get = function () {

      var instance = {};

      instance.isInRole = function (me, role) {

        if (!angular.isArray(role)) {
          role = [role];
        }

        var roles = me.roles.filter(function (x) {
          return role.indexOf(x.name) > -1;
        });

        return roles.length;
      };

      return instance;

    }
  }

  angular.module('lcma')
    .directive('ifRole', IfRoleDirective)
    .provider('$lcmaRole', RoleProvider);

}());
