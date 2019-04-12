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

		.when('/aries', {
			templateUrl: 'views/Aries.html',
			controller: 'AriesController'	
		});

	$locationProvider.html5Mode(true);

}]);