var myApp = angular.module('NerdCtrl', [])

myApp.service('sharedModels', [function () {

    // Shared Models
    this.Array = [];
    this.id_set = new Set([]);
    this.DirtyPage = [];

}]);

myApp.filter("unique", function() {
  // we will return a function which will take in a collection
  // and a keyname
  return function(collection, keyname) {
    // we define our output and keys array;
    var output = [],
      keys = [];

    angular.forEach(collection, function(item) {
      // we check to see whether our object exists
      var key = item[keyname];
      // if it's not already part of our keys array
      if (keys.indexOf(key) === -1) {
        // add it to our keys array
        keys.push(key);
        // push this item to our final output array
        output.push(item);
      }
    });

    return output;
  };
});

myApp.controller('Controller', function($scope, sharedModels) {

        $scope.Array = sharedModels.Array;
        $scope.id_set = sharedModels.id_set;

        $scope.dirtypage = []
        $scope.show_log = false;
        $scope.show_buffer = true;
        // $scope.dirtypage = sharedModels.DirtyPage;
        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {

            if (!$scope.show_buffer){
                $scope.buffer = [];
                $scope.show_buffer = true;
            }
            $scope.buffer = [];
            if ($scope.txn_no != undefined && $scope.txn_type != undefined && $scope.pageid != undefined) {
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = $scope.txn_type;
                txn.pageid = $scope.pageid;


                $scope.Array.push(txn);
                $scope.buffer.push(txn);
                // create a dirty page
                if ($scope.txn_type=="w"){
                    sharedModels.DirtyPage.push(txn);
                    // console.log(txn);
                    // sharedModels.DirtyPage = $scope.dirtypage;
                }
                // $scope.id_set.add(txn.pageid);

                // CLEAR TEXTBOX.
                $scope.txn_no = null;
                $scope.txn_type = null;
                $scope.pageid = null;

            }
        };

        // REMOVE SELECTED ROW(s) FROM TABLE.
        $scope.removeRow = function () {
            var arrTxn = [];
            angular.forEach($scope.Array, function (value) {
                if (!value.Remove) {
                    arrTxn.push(value);
                }
            });
            $scope.Array = arrTxn;
        };

        $scope.commit_2 = function () {
            $scope.show_log = true;
            $scope.dirtypage = sharedModels.DirtyPage;
            $scope.show_buffer = false;
            // console.log($scope.dirtypage);
            // sharedModels.DirtyPage = [];
        };
        // $scope.show = false;

        $scope.commit_1 = function () {
            $scope.show_HardDisk = true;
            $scope.dirtypage = sharedModels.DirtyPage;
            $scope.show_buffer = false;
            // console.log($scope.dirtypage);
            // sharedModels.DirtyPage = [];
        };

        $scope.flush = function () {
            $scope.show_log = false;

            // $scope.dirtypage = sharedModels.DirtyPage;
            // console.log($scope.dirtypage);
            // sharedModels.DirtyPage = [];
        };
});

// myApp.controller('Controller2', function($scope, sharedModels) {

//         $scope.Array = sharedModels.Array;
//         $scope.id_set = sharedModels.id_set;
//         // $scope.dirtypage = sharedModels.DirtyPage;
//         $scope.dirtypage = []
//         $scope.show = false;
//         $scope.show_buffer = true;

//         $scope.commit = function () {
//             $scope.show = true;
//             $scope.dirtypage = sharedModels.DirtyPage;
//             $scope.show_buffer = false;
//             // console.log($scope.dirtypage);
//             // sharedModels.DirtyPage = [];
//         };
//         // $scope.show = false;


//         $scope.flush = function () {
//             $scope.show = false;

//             // $scope.dirtypage = sharedModels.DirtyPage;
//             // console.log($scope.dirtypage);
//             sharedModels.DirtyPage = [];
//         };

// });

// myApp.controller('Controller3', function($scope, sharedModels) {

//         // $scope.Array = sharedModels.Array;
//         // $scope.id_set = sharedModels.id_set;
//         $scope.dirtypage = sharedModels.DirtyPage;
//         // sharedModels.DirtyPage = [];
//         $scope.flush = function () {
//             $scope.show = false;
//             $scope.dirtypage = sharedModels.DirtyPage;
//             // console.log($scope.dirtypage);
//             sharedModels.DirtyPage = [];
//         };

// });






