/**
 *
 */
(function () {
  'use strict';

  function LoginCtrl(Auth, $window, $lcmaAuthToken, $state) {
    var _this = this;

    _this.window = $window;

    /**
     * Holds authentication model values.
     */
    var auth = _this.auth = {};

    /**
     * Initiates user login check.
     * @param form Form to be submitted.
     */
    _this.login = function (form) {
      if (!form.$valid) {
        form.$submitted = true;
        return;
      }

      Auth.login({
          data: {
            username: auth.username,
            password: auth.password
          }
        })
        .then(function (response) {
          $lcmaAuthToken.set(response.data.token);
          $state.go('app.main');
        })
        .catch(function (response) {
          _this.error = response.data.error;
        });
    };
  }

  angular.module('lcma')
    .controller('LoginCtrl', LoginCtrl);

}());
