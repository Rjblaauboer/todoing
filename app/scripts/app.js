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

    var key = window.localStorage.getItem('trello_key');
    var secret = window.localStorage.getItem('trello_secret');

    if (typeof key !== 'undefined' && typeof secret !== 'undefined' && key !== null && secret !== null) {

        TrelloApiProvider.init({
        key: key,
        secret: secret,
        scopes: {read: true, write: false, account: true},
        AppName: 'Todoing'
        });

    };




}]);
