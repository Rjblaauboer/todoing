'use strict';

/**
 * @ngdoc directive
 * @name todoingApp.directive:todoingCard
 * @description
 * # todoingCard
 */
angular.module('todoingApp')
  .directive('todoing', function () {
    return {
      templateUrl: 'views/card.html',
      scope:{
      	member:'=',
      	cards:'=',
      	organisation:'@'
      },
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {


      },
      controller: function($scope, $attrs){

		$scope.cardsLoaded = false;
		$scope.myCards = [];

		todoRegex

        var doingRegex = /(doing)/g;
        var todoRegex = /(to do)/g;
        var predicate = function(listObject){return listObject.name.toLowerCase().match(re); }

		var myCardsFilter = function(card) {
			return card.idMembers.indexOf($scope.member.id) !== -1;
		}

		var myCardsTodoFilter = function(card) {
			return card.list.name.toLowerCase().match(todoRegex);
		}

		var myCardsDoingFilter = function(card) {
			return card.list.name.toLowerCase().match(doingRegex);
		}

		$scope.$watch($attrs['cards'], function (v) {

			$scope.cardsLoaded = (typeof v!== 'undefined');
			$scope.myCards = _.filter($scope.cards, myCardsFilter);
			$scope.myTodoCards = _.filter($scope.myCards, myCardsTodoFilter);
			$scope.myDoingCards = _.filter($scope.myCards, myCardsDoingFilter);

        });

      }
    };
  });
