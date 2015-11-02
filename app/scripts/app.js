'use strict';

/**
 * @ngdoc overview
 * @name todoingApp
 * @description
 * # todoingApp
 *
 * Main module of the application.
 */
angular
  .module('todoingApp', [
    'ngCookies',
    'ngTouch',
    'trello',
    'angular-underscore',
    'LocalStorageModule'
  ])

.config(['TrelloApiProvider', function(TrelloApiProvider) {

	console.log('init trello');

    window.localStorage.setItem('trello_key','b4f03ac87fdb959d645e56f67bc55cd2');

    TrelloApiProvider.init({
        key: 'b4f03ac87fdb959d645e56f67bc55cd2',
        secret: '9ff39d93fe53cb12b50fefaf6d4abc3fb62b9a921e4914567a09874c6dcc1f41',
        scopes: {read: true, write: false, account: true},
        AppName: 'Todoing'
    });


}]);
