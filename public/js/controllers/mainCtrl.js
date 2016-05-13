/*global define, angular, _, audiojs*/
define(['app', 'services/apiServices'], function (app) {
    'use strict';
    app.controller('MainCtrl', ['$scope', 'apiServices', 'ngAudio', function ($scope, apiServices, ngAudio) {
                
        function init() {
            apiServices.getUserLanguage()
                .success(function (userLanguage) {
                    var language = _.head(_.filter($scope.languages, { abv: userLanguage }));
                    $scope.selectedLanguage = (typeof language !== 'undefined') ? language : $scope.languages[0];
                    loadData();
                })
                .error(function (error) {
                    $scope.error = error;
                });
        }
        
        function loadData() {
            $scope.dataLoaded = false;
            apiServices.getData($scope.selectedLanguage.abv)
                .success(function (result) {
                    var minionsAllData = _.filter(result, { 'type': 4 });
                    $scope.minions = _.map(minionsAllData, function (o) { return _.pick(o, ['id', 'image', 'name']); });
                    $scope.dataLoaded = true;
                })
                .error(function (error) {
                    $scope.error = error;
                });
        }
        
        $scope.audio = [];
        
        $scope.languages = [
            { label: 'English', abv: 'www' },
            { label: 'Français', abv: 'fr' },
            { label: 'Deutsch', abv: 'de' },
            { label: 'Español', abv: 'es' },
            { label: 'Italiano', abv: 'it' },
            { label: 'Português Brasileiro', abv: 'pt' },
            { label: 'Русский', abv: 'ru' },
            { label: '한국어', abv: 'ko' },
            { label: '简体中文', abv: 'cn' }
        ];
        
        $scope.onSelectLanguage = function (language) {
            $scope.selectedLanguage = language;
            loadData();
        };
        
        $scope.onSelectMinion = function ($model) {
            $scope.loaderSound = true;
            
            if ($model.hasOwnProperty('id')) {
                apiServices.getCard($model.id, $scope.selectedLanguage.abv)
                    .success(function (result) {
                        $scope.loaderSound = false;
                        $scope.sounds = result.sounds;
                        
                        _.forEach(result.sounds, function (sound) {
                            _.forEach(_.filter(sound.sources, { extension: '.mp3' }), function (mp3) {
                                $scope.audio[sound.id] = ngAudio.load(mp3.src);
                            });
                        });
                    
                        switch ($scope.selectedLanguage.abv) {
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
                            $scope.pathPicsLanguage = $scope.selectedLanguage.abv + $scope.selectedLanguage.abv;
                        }
                    })
                    .error(function (error) {
                        $scope.error = error;
                    });
            }
        };
        
        $scope.onClickRandom = function () {
            var randomMinion = _.sample($scope.minions);
            $scope.selectedMinion = randomMinion;
            $scope.onSelectMinion(randomMinion);
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
