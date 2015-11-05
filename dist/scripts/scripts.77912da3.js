"use strict";angular.module("todoingApp",["ngCookies","ngTouch","trello","angular-underscore","LocalStorageModule"]).config(["TrelloApiProvider",function(a){var b=window.localStorage.getItem("trello_key"),c=window.localStorage.getItem("trello_secret");"undefined"!=typeof b&&"undefined"!=typeof c&&null!==b&&null!==c&&a.init({key:b,secret:c,scopes:{read:!0,write:!1,account:!0},AppName:"Todoing"})}]),angular.module("todoingApp").controller("MainCtrl",["$scope","trelloader",function(a,b){var c=window.localStorage.getItem("trello_key"),d=window.localStorage.getItem("trello_secret"),e=function(){return c=window.localStorage.getItem("trello_key"),d=window.localStorage.getItem("trello_secret"),a.hasCreds=null!==c&&null!==d,a.hasCreds};a.reset=function(){delete window.localStorage.trello_key,delete window.localStorage.trello_secret,delete window.localStorage.trello_organisation,delete window.localStorage.trello_token,window.location.reload()},e(),a.update=function(b){c=window.localStorage.setItem("trello_key",b.key),d=window.localStorage.setItem("trello_secret",b.secret),e()&&(a.hasCreds=!0,window.location.reload())};var f=function(c){b.getCardsForLists(c).then(function(b){console.log("cards ",b),a.cards=b})};a.organisationChanged=function(c){window.localStorage.setItem("trello_organisation",c.id),a.currentOrganisation=c,a.cards=[],a.members=[],a.lists=[],b.getTodoingLists().then(function(b){console.log("lists ",b),a.lists=b,f(b)},function(a){console.error(a)}),b.getMembers().then(function(b){console.log("members ",b),a.members=b},function(a){console.error(a)})};var g=function(){e()&&b.authenticate(function(){b.getOrganisations().then(function(b){console.log("organisations ",b),a.organisations=b;var c=window.localStorage.getItem("trello_organisation");c?a.currentOrganisation=_.filter(b,function(a){return a.id===c})[0]:a.currentOrganisation=b[0],console.log("current org :",a.currentOrganisation),a.currentOrganisation&&a.organisationChanged(a.currentOrganisation)},function(a){console.error(a)})})};g()}]),angular.module("todoingApp").service("trelloader",["TrelloApi","$q","localStorageService","$http",function(a,b,c,d){var e=!1,f=function(b){a.Authenticate().then(function(){e=!0,b(e)},function(){e=!1,b(e)})},g=function(a){organisation=a},h=function(b){var c=window.localStorage.getItem("trello_organisation");return a.Rest("GET","organizations/"+c+"/members/"+b+"/cards/?open=true")},i=function(){var a=b.defer(),c=window.localStorage.getItem("trello_organisation"),e=window.localStorage.getItem("trello_key"),f=window.localStorage.getItem("trello_token");return d.get("https://api.trello.com/1/organizations/"+c+"/members/?fields=all&token="+f+"&key="+e).then(function(b){a.resolve(b.data)},function(b){a.reject(b)}),a.promise},j=function(){var a=b.defer(),c=window.localStorage.getItem("trello_organisation"),e=window.localStorage.getItem("trello_key"),f=window.localStorage.getItem("trello_token");return d.get("https://api.trello.com/1/organizations/"+c+"/boards/?open=true&lists=open&fields=name&filter=open&token="+f+"&key="+e).then(function(b){a.resolve(b.data)},function(b){a.reject(b)}),a.promise},k=function(){var a=b.defer(),c=window.localStorage.getItem("trello_key"),e=window.localStorage.getItem("trello_token");return d.get("https://api.trello.com/1/members/me/organizations?token="+e+"&key="+c).then(function(b){a.resolve(b.data)},function(b){a.reject(b)}),a.promise},l=function(a){var c=b.defer(),e=window.localStorage.getItem("trello_key"),f=window.localStorage.getItem("trello_token");return d.get("https://api.trello.com/1/lists/"+a.id+"/cards?token="+f+"&key="+e+"&filter=open").then(function(b){_.map(b.data,function(b){b.list=a,b.board=a.board}),c.resolve(b.data)},function(a){c.reject(a)}),c.promise},m=function(a){var c=[];angular.forEach(a,function(a){c.push(l(a))});var d=b.defer();return b.all(c).then(function(a){var b=_.flatten(a);d.resolve(b)}),d.promise},n=function(){var a=b.defer();return j().then(function(b){for(var c=/(doing|to do)/g,d=function(a){return a.name.toLowerCase().match(c)},e=_.chain(b).pluck("lists").flatten().filter(d).value(),f=e.length-1;f>=0;f--)for(var g=b.length-1;g>=0;g--)b[g].id===e[f].idBoard&&(e[f].board=b[g],delete e[f].idBoard);a.resolve(e)}),a.promise};return{authenticate:f,getOrganisations:k,getCardsForLists:m,getMembers:i,getTodoingLists:n,setOrganisation:g,getMemberCards:h}}]),angular.module("todoingApp").directive("todoing",function(){return{templateUrl:"views/card.html",scope:{member:"=",cards:"=",organisation:"@"},restrict:"EA",link:function(a,b,c){},controller:["$scope","$attrs",function(a,b){a.cardsLoaded=!1,a.myCards=[];var c=/(doing)/g,d=/(to do)/g,e=function(b){return-1!==b.idMembers.indexOf(a.member.id)},f=function(a){return a.list.name.toLowerCase().match(d)},g=function(a){return a.list.name.toLowerCase().match(c)};a.$watch(b.cards,function(b){a.cardsLoaded="undefined"!=typeof b,a.myCards=_.filter(a.cards,e),a.myTodoCards=_.filter(a.myCards,f),a.myDoingCards=_.filter(a.myCards,g)})}]}}),angular.module("todoingApp").run(["$templateCache",function(a){a.put("views/card.html",'<div class="panel panel-default panel-todoing" ng-show="myCards.length"> <div class="panel-heading"> <img class="" ng-show="member.avatarHash" ng-src="{{\'https://trello-avatars.s3.amazonaws.com/\'+member.avatarHash+\'/30.png\'}}"> <h3>{{member.fullName}}</h3> <h4><span class="label hidden" ng-class="myCards.length>5?\'label-danger\':\'label-success\'">{{myCards.length}}</span></h4> </div> <div class="panel-body"> <div class="col-sm-6"> <div class="card-title"> <h4>to do <span class="label" ng-class="myTodoCards.length>3?\'label-danger\':\'label-success\'">{{myTodoCards.length}}</span></h4> </div> <div class="cell-column"> <div class="todoing-cell" ng-repeat="card in myTodoCards"> <a href="{{card.url}}"> <span class="label label-default">{{card.board.name}}</span><br> <p>{{card.name}}</p> </a> </div> </div> </div> <div class="col-sm-6"> <div class="card-title"> <h4>doing <span class="label" ng-class="myDoingCards.length>1?\'label-danger\':\'label-success\'">{{myDoingCards.length}}</span></h4> </div> <div class="cell-column"> <div class="todoing-cell" ng-repeat="card in myDoingCards"> <a href="{{card.url}}"> <span class="label label-default">{{card.board.name}}</span><br> <p>{{card.name}}</p> </a> </div> </div> </div> </div> </div>'),a.put("views/main.html",'<nav class="navbar navbar-default"> <div class="container-fluid"> <ul class="nav navbar-nav"> <di v="brand-container"> <li><a class="navbar-brand" href="{{currentOrganisation.url}}">Who\'s doing what @ {{currentOrganisation.displayName}}</a></li> </di></ul></div>  <ul class="nav navbar-nav navbar-right" ng-show="hasCreds"> <button type="button" class="btn btn-default btn-xs dropdown-toggle btn-organisation" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{currentOrganisation.displayName }} <span class="caret"></span></button> <ul class="dropdown-menu"> <li ng-repeat="org in organisations" ng-click="organisationChanged(org)"><a href="#">{{org.displayName}}</a></li> <li role="separator" class="divider"></li> <li ng-click="reset()"><a href="#">Logout</a></li> </ul> </ul>  </nav> <div class="container-fluid" ng-show="hasCreds"> <div class="col-sm-6 col-md-4" ng-repeat="member in members"> <todoing member="member" cards="cards" organisation="currentOrganisation.id"></todoing> </div> </div> <div class="container" ng-show="!hasCreds"> <h3>looks like you dont have any credentials...</h3> <h5><a href="https://trello.com/app-key">get you application key and secret here</a></h5> <form novalidate class="simple-form"> <div class="form-group"> key: <input type="text" class="form-control" ng-model="creds.key"><br> </div> <div class="form-group"> secret: <input type="text" class="form-control" ng-model="creds.secret"><br> </div> <button type="submit" class="btn btn-success" ng-click="update(creds)" value="Save">save</button> </form> </div>')}]);