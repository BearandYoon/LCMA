(function () {
    'use strict';

    /**
     * Responsible for managing authorization token.
     * @constructor
     */
    function AuthToken() {

        var AUTH_TOKEN_KEY = 'cloudagesolutions.com';

        this.$get = ['$cookies',function ($cookies) {

            var token = {};

            /**
             * Gets authorization token as string.
             * @returns {*|string}
             */
            token.get = function () {
                var token = $cookies.get(AUTH_TOKEN_KEY);
                // token is stored as object so need to convert to JSON.
                if(token) {
                    return JSON.parse(token);
                }
            };

            /**
             * Sets authorization token to be used by application.
             * @param value
             * @param expires
             */
            token.set = function (value, expires) {
                // Stringify object and store it in cookie.
                $cookies.put(AUTH_TOKEN_KEY, JSON.stringify(value), {
                    //expires: expires
                });
            };

            /**
             * Removes authorization token from client's storage.
             */
            token.remove = function () {
                $cookies.remove(AUTH_TOKEN_KEY);
            };

            return token;
        }];
    }

    angular.module('lcma')
        .provider('$lcmaAuthToken', AuthToken);

}());
