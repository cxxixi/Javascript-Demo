angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/db', {
			templateUrl: 'views/db.html',
			controller: 'Controller'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'
		})

		.when('/aries', {
			templateUrl: 'views/aries.html',
			controller: 'AriesController'
		});

	$locationProvider.html5Mode(true);

}]);