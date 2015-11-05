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


    var key = window.localStorage.getItem('trello_key');
    var secret = window.localStorage.getItem('trello_secret');

    $scope.loaded = false;

    var checkCreds = function(){
    	key = window.localStorage.getItem('trello_key');
    	secret = window.localStorage.getItem('trello_secret');
    	$scope.hasCreds = (key !== null &&  secret !== null);
      if (!$scope.hasCreds) {$scope.loaded = true;};
    	return  $scope.hasCreds;
    }

    $scope.reset = function reset(){
    	delete window.localStorage["trello_key"];
    	delete window.localStorage["trello_secret"];
    	delete window.localStorage["trello_organisation"];
    	delete window.localStorage["trello_token"];
    	window.location.reload();
    }

    checkCreds();

    $scope.update = function update(creds) {
    	key = window.localStorage.setItem('trello_key', creds.key);
	    secret = window.localStorage.setItem('trello_secret', creds.secret);
	    if(checkCreds()){
	    	$scope.hasCreds = true;
	    	window.location.reload();
	    };
    }

  	var getCardsForLists = function(lists) {
  		trelloader.getCardsForLists(lists).then(function(cards){
  			console.log('cards ', cards);
  	    $scope.cards = cards;
        $scope.loaded = true;
  		});
  	}

  	$scope.organisationChanged = function(organisation) {

  		window.localStorage.setItem('trello_organisation', organisation.id);

      $scope.currentOrganisation = organisation;

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



  	var init = function(){

  		if (!checkCreds()) {return;};

	  	trelloader.authenticate(function(){

		    trelloader.getOrganisations().then(function(organisations){

	  	    	console.log('organisations ', organisations);

	  	    	$scope.organisations = organisations;

	  	    	var organisationId = window.localStorage.getItem('trello_organisation');

	  	    	if (!organisationId) {
					    $scope.currentOrganisation = organisations[0];
	  	    	} else {
		  	    	$scope.currentOrganisation =  _.filter(organisations, function(org){
		  	    		return org.id === organisationId;
		  	    	})[0];
	  	    	}	

	  	    	console.log('current org :', $scope.currentOrganisation);

    				if ($scope.currentOrganisation) {
    					$scope.organisationChanged($scope.currentOrganisation);
    				};

		    }, function(err){
		        console.error(err);
		    });

	    });
	};
	init();


  });
