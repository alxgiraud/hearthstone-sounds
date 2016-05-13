/*global define*/
define(['app'], function (app) {
    'use strict';
    app.factory('apiServices', ['$http', function ($http) {
        var urlBase = '/api';

        return {
            getUserLanguage: function () {
                return $http.get(urlBase + '/language');
            },
            getData: function (language) {
                return $http.get('../data/data-' + language + '.json');
            },
            getCard: function (id, language) {
                return $http.get(urlBase + '/card/' + id + '/' + language);
            }
        };
    }]);
});
