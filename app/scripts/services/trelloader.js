'use strict';

/**
 * @ngdoc service
 * @name todoingApp.trelloader
 * @description
 * # trelloader
 * Service in the todoingApp.
 */
angular.module('todoingApp')
  .service('trelloader', function (TrelloApi, $q, localStorageService, $http) {

  	var authenticated = false;
    var organisation  = window.localStorage.getItem('trello_organisation');
    var key = window.localStorage.getItem('trello_key');
    var token = window.localStorage.getItem('trello_token');


    var authenticate = function(callback){

        TrelloApi.Authenticate().then(function(){
            authenticated = true;
            callback(authenticated);
        }, function(){
        	authenticated = false;
            callback(authenticated);
        });

    };


    var setOrganisation = function(org) {
        organisation = org;
    }

    var getMemberCards = function getMemberCards(memberId) {
        organisation  = window.localStorage.getItem('trello_organisation');
        return TrelloApi.Rest('GET', 'organizations/'+organisation+'/members/'+memberId+'/cards/?open=true');
    };

    var getList = function getMemberCards(listId) {
        return TrelloApi.Rest('GET', 'https://api.trello.com/1/lists/'+listId+'/name');
    };

    var getMembers = function getMembers() {

        var deferred = $q.defer();

        organisation  = window.localStorage.getItem('trello_organisation');

        $http.get('https://api.trello.com/1/organizations/'+organisation+'/members/?token='+token+'&key='+key).then(function(members){
            deferred.resolve(members.data);
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var getBoards = function getMembers() {

        var deferred = $q.defer();

        organisation  = window.localStorage.getItem('trello_organisation'); 
        
        $http.get('https://api.trello.com/1/organizations/'+organisation+'/boards/?open=true&lists=open&fields=name&filter=open&token='+token+'&key='+key).then(function(boards){
            deferred.resolve(boards.data);
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;

    };


    var getOrganisations = function getOrganisations(){

        //GET https://api.trello.com/1/organizations/myorganization
        var deferred = $q.defer();

        $http.get('https://api.trello.com/1/members/me/organizations?token='+token+'&key='+key).then(function(_organisations){
            deferred.resolve(_organisations.data);
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;

    }

    //lists/[idList]/cards/[filter]
    var getCardsForList = function(list) {

        var deferred = $q.defer();

        var key = window.localStorage.getItem('trello_key');
        var token = window.localStorage.getItem('trello_token');

        $http.get('https://api.trello.com/1/lists/'+list.id+'/cards?token='+token+'&key='+key+'&filter=open').then(function(_cards){
            _.map(_cards.data, function(data){return data['list'] = list});
            deferred.resolve(_cards.data);
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;

    }

    var getCardsForLists = function(lists) {

        var promises = [];

        angular.forEach(lists , function(list) {
            promises.push(getCardsForList(list));
        });

        var deferred = $q.defer();

        $q.all(promises).then(function(listCards){
            var cards = _.flatten(listCards);
            deferred.resolve(cards);
        });

        return deferred.promise;

    }


    var getTodoingLists = function getTodoingLists(){

        var deferred = $q.defer();

        getBoards().then(function(boards){

            var re = /(doing|to do)/g;
            var predicate = function(listObject){return listObject.name.toLowerCase().match(re); }
            var lists = _.chain(boards).pluck('lists').flatten().filter(predicate).value();

            deferred.resolve(lists);
        });

        return deferred.promise;

    };


    return {
        authenticate:authenticate,
        getOrganisations:getOrganisations,
        getCardsForLists:getCardsForLists,
        getMembers:getMembers,
        getTodoingLists:getTodoingLists,
        setOrganisation:setOrganisation,
        getMemberCards:getMemberCards
    }

  });