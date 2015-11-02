'use strict';

/**
 * @ngdoc function
 * @name todoingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the todoingApp
 */
angular.module('todoingApp')
  .controller('MainCtrl', function ($scope, trelloader) {



  	var getCardsForLists = function(lists) {
  		trelloader.getCardsForLists(lists).then(function(cards){
  			console.log('cards ', cards);
  	    	$scope.cards = cards;
  		});
  	}

  	$scope.organisationChanged = function(organisation) {

  		window.localStorage.setItem('trello_organisation', organisation.id);

  	    $scope.cards = [];
  	    $scope.members = [];
  	    $scope.lists = [];

  		trelloader.getTodoingLists().then(function(lists){
  	    	console.log('lists ', lists);
  	    	$scope.lists = lists;
  	    	getCardsForLists(lists);
	    }, function(err){
	        console.error(err);
	    });

	    trelloader.getMembers().then(function(members){
  	    	console.log('members ', members);
  	    	$scope.members = members;
	    }, function(err){
	        console.error(err);
	    });

  	}

  	trelloader.authenticate(function(){

	    trelloader.getOrganisations().then(function(organisations){

  	    	console.log('organisations ', organisations);

  	    	$scope.organisations = organisations;

  	    	var organisationId = window.localStorage.getItem('trello_organisation');

  	    	$scope.currentOrganisation =  _.filter(organisations, function(org){
  	    		return org.id === organisationId;
  	    	})[0];

  	    	console.log('current org :', $scope.currentOrganisation);

			if ($scope.currentOrganisation) {
				$scope.organisationChanged($scope.currentOrganisation);
			};

	    }, function(err){
	        console.error(err);
	    });


    });



  });