// declare the app with no dependencies
var myApp = angular.module('myApp', []);


myApp.factory('Data', function(){
    return { FirstName: '' };
});

myApp.controller('FirstCtrl', function( $scope, Data ){
	$scope.Data = Data;
});

myApp.controller('SecondCtrl', function( $scope, Data ){
	$scope.Data = Data;
});