/*global define, angular, _, audiojs*/
define(['app', 'services/apiServices'], function (app) {
    'use strict';
    app.controller('MainCtrl', ['$scope', '$window', 'apiServices', 'ngAudio', function ($scope, $window, apiServices, ngAudio) {
                
        function init() {
            $scope.selectedLanguage = getUserLanguage();
            loadMinions();
        }
        
        function getUserLanguage() {
            var navigatorLanguage = $window.navigator.language || $window.navigator.userLanguage,
                sub;
            console.log(navigatorLanguage)

            if (!navigatorLanguage.lastIndexOf('fr', 0)) {
                sub = 'fr';
            } else if (!navigatorLanguage.lastIndexOf('de', 0)) {
                sub = 'de';
            } else if (!navigatorLanguage.lastIndexOf('es', 0)) {
                sub = 'es';
            } else if (!navigatorLanguage.lastIndexOf('it', 0)) {
                sub = 'it';
            } else if (!navigatorLanguage.lastIndexOf('pt', 0)) {
                sub = 'pt'
            } else if (!navigatorLanguage.lastIndexOf('ru', 0)) {
                sub = 'ru'
            } else if (!navigatorLanguage.lastIndexOf('zh', 0)) {
                sub = 'cn'
            } else if (navigatorLanguage === 'ko') {
                sub = 'ko';
            } else {
                sub = 'www';
            }
            return _.head(_.filter($scope.languages, { sub: sub }));
        }
        
        function loadMinions() {
            $scope.dataLoaded = false;
            apiServices.getMinions($scope.selectedLanguage.sub)
                .success(function (minions) {
                    $scope.minions = minions;
                    $scope.dataLoaded = true;
                
                    if (typeof $scope.selectedMinion !== 'undefined') {
                        $scope.selectedMinion = _.head(_.filter(minions, { id: $scope.selectedMinion.id }));
                        $scope.onSelectMinion($scope.selectedMinion.id);
                    }
                
                })
                .error(function (error) {
                    $scope.error = error;
                });
        }
        
        function setPathImage() {
            switch ($scope.selectedLanguage.sub) {
                case 'pt':
                    $scope.pathPicsLanguage = 'ptbr';
                    break;
                case 'cn':
                    $scope.pathPicsLanguage = 'zhcn';
                    break;
                case 'ko':
                case 'www':
                    $scope.pathPicsLanguage = 'enus';
                    break;
                default:
                    $scope.pathPicsLanguage = $scope.selectedLanguage.sub + $scope.selectedLanguage.sub;
            }
        }
        
        $scope.audio = [];
        
        $scope.languages = [
            { label: 'English', sub: 'www' },
            { label: 'Français', sub: 'fr' },
            { label: 'Deutsch', sub: 'de' },
            { label: 'Español', sub: 'es' },
            { label: 'Italiano', sub: 'it' },
            { label: 'Português Brasileiro', sub: 'pt' },
            { label: 'Русский', sub: 'ru' },
            { label: '한국어', sub: 'ko' },
            { label: '简体中文', sub: 'cn' }
        ];
        
        $scope.onSelectLanguage = function (language) {
            $scope.selectedLanguage = language;
            loadMinions();
        };
        
        $scope.onSelectMinion = function (id) {
            $scope.loaderSound = true;
            apiServices.getSounds(id, $scope.selectedLanguage.sub)
                .success(function (result) {
                    $scope.loaderSound = false;
                    $scope.sounds = result.sounds;

                    setPathImage();

                    _.forEach(result.sounds, function (sound) {
                        _.forEach(_.filter(sound.sources, { extension: '.mp3' }), function (mp3) {
                            $scope.audio[sound.id] = ngAudio.load(mp3.src);
                        });
                    });
                })
                .error(function (error) {
                    $scope.error = error;
                });
        };
        
        $scope.onClickRandom = function () {
            var randomMinion = _.sample($scope.minions);
            $scope.selectedMinion = randomMinion;
            $scope.onSelectMinion(randomMinion.id);
        };
                
        $scope.stop = function (id) {
            if (typeof $scope.audio[id] !== 'undefined') {
                $scope.audio[id].stop();
                $scope.audio[id] = ngAudio.load($scope.audio[id].src);
            }
        };
        
        init();
    }]);
});
