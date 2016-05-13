/*global require*/
require.config({
    baseUrl: "js",
    paths: {
        'angular': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular',
        'angular-route': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route',
        'angularAMD': 'https://cdn.jsdelivr.net/angular.amd/0.2/angularAMD.min',
        'ng-lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.11.2/lodash.min',
        'ui-bootstrap': 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.2/ui-bootstrap',
        'ui-bootstrap-tpls': 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.2/ui-bootstrap-tpls',
        'ng-audio': './lib/angular.audio'
    },
    shim: {
        'angular-route': ['angular'],
        'angularAMD': ['angular'],
        'ng-lodash': ['angular'],
        'ui-bootstrap': ['angular'],
        'ui-bootstrap-tpls': ['angular'],
        'ng-audio': ['angular']
    },
    deps: ['app']
});
