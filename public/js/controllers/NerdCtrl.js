var myApp = angular.module('NerdCtrl', [])

myApp.service('sharedModels', [function () {

    // Shared Models
    this.movieArray = [];
    this.id_set = new Set([]);


}]);

// factory('sharedModels',function(){
//     return 
//         movieArray = [];
// }).

// myApp.controller('Ctrl1', ['$scope', 'sharedModels', function($scope, sharedModels) {
    
//     $scope.myBreakfast = sharedModels.breakfast;
// }]);

myApp.controller('Controller1', function($scope, sharedModels) {

		$scope.movieArray = sharedModels.movieArray;
        $scope.id_set = sharedModels.id_set;
        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {
            if ($scope.txn_no != undefined && $scope.txn_type != undefined && $scope.pageid != undefined) {
                var movie = [];
                movie.txn_no = $scope.txn_no;
                movie.txn_type = $scope.txn_type;
                movie.pageid = $scope.pageid;

                $scope.movieArray.push(movie);
                // $scope.id_set.add(movie.pageid);

                // CLEAR TEXTBOX.
                $scope.txn_no = null;
                $scope.txn_type = null;
                $scope.pageid = null;
            }
        };

        // REMOVE SELECTED ROW(s) FROM TABLE.
        $scope.removeRow = function () {
            var arrMovie = [];
            angular.forEach($scope.movieArray, function (value) {
                if (!value.Remove) {
                    arrMovie.push(value);
                }
            });
            $scope.movieArray = arrMovie;
        };

        // FINALLY SUBMIT THE DATA.
        $scope.submit = function () {
            var arrMovie = [];
            angular.forEach($scope.movieArray, function (value) {
                arrMovie.push('txn_no:' + value.txn_no + ', type:' + value.txn_type, ', pageid:' + value.pageid);
            });
            $scope.display = arrMovie;
        };
});

myApp.controller('Controller2', function($scope, sharedModels) {

		$scope.movieArray = sharedModels.movieArray;
        $scope.id_set = sharedModels.id_set;

        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {
            if ($scope.txn_no != undefined && $scope.txn_type != undefined && $scope.pageid != undefined) {
                var movie = [];
                movie.txn_no = $scope.txn_no;
                movie.txn_type = $scope.txn_type;
                movie.pageid = $scope.pageid;

                $scope.movieArray.push(movie);
                $scope.id_set.add(movie.pageid);

                // CLEAR TEXTBOX.
                $scope.txn_no = null;
                $scope.txn_type = null;
                $scope.pageid = null;
            }
        };

        // REMOVE SELECTED ROW(s) FROM TABLE.
        $scope.removeRow = function () {
            var arrMovie = [];
            angular.forEach($scope.movieArray_1, function (value) {
                if (!value.Remove) {
                    arrMovie.push(value);
                }
            });
            $scope.movieArray_1 = arrMovie;
        };

        // FINALLY SUBMIT THE DATA.
        $scope.submit = function () {
            var arrMovie = [];
            angular.forEach($scope.movieArray_1, function (value) {
                arrMovie.push('txn_no:' + value.txn_no + ', type:' + value.txn_type, ', pageid:' + value.pageid);
            });
            $scope.display = arrMovie;
        };
});


