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

    // we utilize angular's foreach function
    // this takes in our original collection and an iterator function
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

myApp.controller('Controller1', function($scope, sharedModels) {

        $scope.Array = sharedModels.Array;
        $scope.id_set = sharedModels.id_set;
        $scope.dirtypage = sharedModels.DirtyPage;
        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {
            if ($scope.txn_no != undefined && $scope.txn_type != undefined && $scope.pageid != undefined) {
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = $scope.txn_type;
                txn.pageid = $scope.pageid;

                $scope.Array.push(txn);
                // create a dirty page
                if ($scope.txn_type=="w"){
                    $scope.dirtypage.push(txn);
                }
                // $scope.id_set.add(txn.pageid);

                // CLEAR TEXTBOX.
                $scope.txn_no = null;
                $scope.txn_type = null;
                $scope.pageid = null;
            }
        };

        sharedModels.DirtyPage = $scope.dirtypage;


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

        // FINALLY SUBMIT THE DATA.
        $scope.submit = function () {
            var arrTxn = [];
            angular.forEach($scope.Array, function (value) {
                arrTxn.push('txn_no:' + value.txn_no + ', type:' + value.txn_type, ', pageid:' + value.pageid);
            });
            $scope.display = arrTxn;
        };
});

myApp.controller('Controller2', function($scope, sharedModels) {

        $scope.Array = sharedModels.Array;
        $scope.id_set = sharedModels.id_set;

        $scope.commit = function () {
            $scope.dirtypage = sharedModels.DirtyPage;
        };
        sharedModels.DirtyPage = [];

});

// myApp.controller('Controller3', function($scope, sharedModels) {

//         // $scope.Array = sharedModels.Array;
//         // $scope.id_set = sharedModels.id_set;
//         $scope.dirtypage = sharedModels.DirtyPage;
//         // sharedModels.DirtyPage = [];

// });






