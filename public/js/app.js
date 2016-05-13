/*global define, angular*/
define(['angularAMD', 'angular-route', 'ng-lodash', 'ui-bootstrap', 'ui-bootstrap-tpls', 'ng-audio'], function (angularAMD) {
    'use strict';
    var app = angular.module('hearthstone-sounds', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.tpls', 'ngAudio']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', angularAMD.route({
                templateUrl: '../views/main.html',
                controller: 'MainCtrl',
                controllerUrl: 'controllers/mainCtrl'
            }))
            .otherwise({
                redirectTo: '/'
            });
    });

    app.filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

    return angularAMD.bootstrap(app);
});
