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
        $scope.count_in_disk = 4;
        // $scope.AllRecords = [[1,2,"1"],['1','1','']];
        $scope.AllRecords = [[1,2,"","",""],["","","",9,""],["","",13,"",""],["","","","",""]];
        $scope.PageInDisk = new Set([1,2,9,13]);

        $scope.capacity = 20;
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
                if ($scope.txn_type=="W"){
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

            // for (i=0; i<$scope.dirtypage.length; i++){
            //     if $scope.PageInDisk.has()
            // }
            $scope.count_in_disk += $scope.dirtypage.length;
            $scope.buffer = [];   
            $scope.Array = [];
            console.log($scope.count_in_disk);
            // sharedModels.DirtyPage = [];
         
            if ($scope.count_in_disk <= $scope.capacity){
            //     //feasible
                $scope.rest_idx = [];
                for (k=0; k<$scope.capacity; k++){
                    i = parseInt(k/5);
                    j = k-5*i;
                    if($scope.AllRecords[i][j]==""){
                        $scope.rest_idx.push([i,j]);
                    }
                }
                // console.log($scope.rest_idx);
                var idx_list = new Set([]);
                // console.log($scope.dirtypage.length);
                while (idx_list.size<$scope.dirtypage.length){
                // for (k = $scope.rest_idx.length; k--;){
                    randomIndex = Math.floor(Math.random()*$scope.rest_idx.length);
                    if(!idx_list.has(randomIndex)){
                        idx_list.add(randomIndex)
                    }

                }
                console.log($scope.dirtypage);
                var iterator1 = idx_list.values();
                for(k=0; k<$scope.dirtypage.length; k++){
                    
                    
                    idx = iterator1.next().value;
                    // console.log(idx);
                    i = $scope.rest_idx[idx][0];
                    // console.log(i);
                    j = $scope.rest_idx[idx][1];


                    $scope.AllRecords[i][j] = $scope.dirtypage[k].pageid;
                }
               
                // var random = $scope.rest_idx.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
                // console.log(idx_list);
                // for 
                //
            }
            // sharedModels.DirtyPage = [];
            // $scope.dirtypage = [];
        };

        $scope.flush = function () {
            $scope.show_log = false;
            $scope.count_in_disk += $scope.dirtypage.size();


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






