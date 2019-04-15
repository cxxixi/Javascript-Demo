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

		.when('/buffer', {
			templateUrl: 'views/buffer.html',
			controller: 'BufController'	
		})

		.when('/logging', {
			templateUrl: 'views/logging.html',
			controller: 'LogController'	
		})

		.when('/recovery', {
			templateUrl: 'views/recovery.html',
			controller: 'RecController'	
		});
	$locationProvider.html5Mode(true);

}]);