// // declare the app with no dependencies
// var myApp = angular.module('myApp', []);


// myApp.factory('Data', function(){
//     return { FirstName: '' };
// });

// myApp.controller('FirstCtrl', function( $scope, Data ){
// 	$scope.Data = Data;
// });

// myApp.controller('SecondCtrl', function( $scope, Data ){
// 	$scope.Data = Data;
// });


// Declare the main module
var myApp = angular.module('myApp', []);

myApp.service('sharedModels', [function () {

    'use strict';

    // Shared Models
    this.breakfast = {food: 'eggs'};

}]);

myApp.controller('Ctrl1', ['$scope', 'sharedModels', function($scope, sharedModels) {
    
    $scope.myBreakfast = sharedModels.breakfast;
}]);

myApp.controller('Ctrl2', ['$scope', 'sharedModels', function($scope, sharedModels) {
    
    $scope.yourBreakfast = sharedModels.breakfast;
}]);

myApp.controller('Ctrl3', ['$scope', 'sharedModels', function($scope, sharedModels) {
    
    $scope.ourBreakfast = sharedModels.breakfast;
}]);