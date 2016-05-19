/*global define*/
define(['app'], function (app) {
    'use strict';
    app.factory('apiServices', ['$http', function ($http) {
        var urlBase = '/api';

        return {
            getMinions: function (language) {
                return $http.get(urlBase + '/minions/' + language);
            },
            getSounds: function (id, language) {
                return $http.get(urlBase + '/sounds/' + id + '/' + language);
            }
        };
    }]);
});
