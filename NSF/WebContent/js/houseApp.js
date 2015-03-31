(function(){
	
	//defines the AngularJS app as a module
	angular.module('houseApp', ['ui.router']) //'ngAnimate'

	//ui-router config
	.config(
		function($stateProvider, $urlRouterProvider){

			$urlRouterProvider.otherwise('/houses');

			$stateProvider
				.state('houses', {
					url: '/houses',
					templateUrl: 'partials/houseList.html',
					controller: 'HouseListCtrl'
				})
				.state('houses.item', {
					url: '/:item',
					templateUrl: 'partials/house.html',
					controller: 'OneHouseCtrl'
				});
	})

	/*
	 *	Factories
	 */
	
	//defines the $HTTP factory, one of the 3 service types
	.factory('houseCollectionFactory', [ '$http', function($http) {
		return $http( {
			method : 'GET',
			url : 'xsp/houses'
		});
	} ])

	.factory('houseFactory', [ '$http', function($http){
		return function(id){
			return $http( {
				method : 'GET',
				url : 'xsp/houses/'+id
			});
		}
	}])

	/*
	 *	Controllers
	 */

	//navigation controller
	.controller('NavCtrl', function($scope, $location){
		$scope.isActive = function(route) {
	    	return route === $location.path();
	    }
	})
	
	//provies the controller to the app, which handles the interaction of data (model) with the view (a la MVC)
	.controller('HouseListCtrl', function($scope, $filter, houseCollectionFactory) {
		
		//defines filter/search/etc. vars
		$scope.pageQty = 5; //detectPhone() ? 10 : 30;
		$scope.curPage = 0;
		
		//calculates the number of results
		$scope.numberOfPages = function() {
			return Math.ceil($scope.housesOfWesteros.length / $scope.pageQty) || 0;
		}
		
		//defines a boolean var
		$scope.showSearch = false;
		
		$scope.housesOfWesteros = [];
		//the factory is returning the promise of the $http, so handle success/error here
		houseCollectionFactory
			.success( function(data, status, headers, config) {
				$scope.housesOfWesteros = data.dataAr;
				//$scope.predicate = "JobNum";
				//$scope.reverse = false;
			}).error( function(data, status, headers, config) {
				$scope.housesOfWesteros = null;
				console.log("data: " + data);
				console.log("status: " + status);
				console.log("headers: " + headers);
				console.log("config: " + JSON.parse(config));
			})
			 .then( function(){
				//angular.element('div.screenMask').css('visibility','hidden');
			});
		
	})
	
	.controller('OneHouseCtrl', function($scope, $stateParams, $window, houseFactory){
		$scope.editForm = false;
		$scope.canEditForm = false;
		$scope.myHouse = {};
		houseFactory($stateParams.item)
			.success(function(data, status, headers, config) {
				$scope.myHouse = data;
				$scope.canEditForm = true;
			})
			.error(function(data, status, headers, config) {
				console.log("status: "+status);
				console.log("data: "+data);
				console.log("headers: "+headers);
				console.log("config: "+JSON.parse(config));
			});
		$scope.setFormEditable = function() {
			if( $scope.canEditForm == true ){
				$scope.editForm = true;
			}
		}
		$scope.clearCancelForm = function() {
			$window.location.href = '#/houses';
		}
	})

	/*
	 *	Filters
	 */
	
	// we already use the limitTo filter built-in to AngularJS,
	// this is a custom filter for startFrom
	.filter('startFrom', function() {
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	})

	/*
	 *	Directives
	 */

	//This directive allows us to pass a function in on an enter key to do what we want.
	.directive('ngEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });
	                event.preventDefault();
	            }
	        });
	    };
	})

	/**
	 * A generic confirmation for risky actions.
	 * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
	 */
	.directive('ngReallyClick', [function() {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            element.bind('click', function() {
	                var message = attrs.ngReallyMessage;
	                if (message && confirm(message)) {
	                    scope.$apply(attrs.ngReallyClick);
	                }
	            });
	        }
	    }
	}]);

})();