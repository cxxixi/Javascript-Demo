angular.module('NerdCtrl', []).controller('NerdController', function($scope) {

	$scope.tagline = 'Nothing beats a pocket protector!';
	$scope.name = "";


	$scope.myText = "Let's go";

    $scope.arrayText = [
            'Hello',
            'world'
        ];

    $scope.addText = function() {
        $scope.arrayText.push(this.myText);
        $scope.$apply();
    }
$scope.movieArray =
        [
            // { 'txn_no': '1', 'txn_type': 'R', 'pageid': '1'},
            // { 'txn_no': '2', 'txn_type': 'R' ,'pageid': '2'},
            // { 'txn_no': '1', 'txn_type': 'W' ,'pageid': '1'}
        ];

        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {
            if ($scope.txn_no != undefined && $scope.txn_type != undefined && $scope.pageid != undefined) {
                var movie = [];
                movie.txn_no = $scope.txn_no;
                movie.txn_type = $scope.txn_type;
                movie.pageid = $scope.pageid;

                $scope.movieArray.push(movie);

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


