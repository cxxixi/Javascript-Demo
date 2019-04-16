var myApp = angular.module('RecCtrl', [])

myApp.service('sharedModels', [function () {

    // Shared Models
    this.Array = [];
    this.id_set = new Set([]);
    this.DirtyPage = [];
    this.dp_buffer = [];
    this.PageInDisk = new Set(["1","2","9","13"]);

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

myApp.controller('RecController', function($scope, sharedModels) {

        $scope.Array = sharedModels.Array;

        $scope.dp_buffer = [];
        $scope.id_set = sharedModels.id_set;
        $scope.choices = ['Write', 'Commit', 'Checkpoint', 'Abort'];
        $scope.PagetoWrite = [];
        //default is randomly write
        $scope.write_mode = 1;
        $scope.dirtypage = [];
        $scope.show_log = false;
        $scope.show_buffer = true;
        $scope.show_checkpoint = false;
        $scope.actTrans = new Set([]); // active Transactions
        $scope.actArr = [];


        $scope.count_in_disk = 4;
        $scope.AllRecords = [["1","2","","",""],["","","","9",""],["","","13","",""],["","","","",""]];
        $scope.PageInDisk = new Set(["1","2","9","13"]);
        // $scope.PageInDisk = sharedModels.PageInDisk;
        $scope.capacity = 20;

        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {

            if (!$scope.show_buffer){
                $scope.buffer = [];
                $scope.show_buffer = true;
            }
            $scope.buffer = [];
            if ($scope.txn_no != undefined && $scope.selectedType != undefined && $scope.pageid != undefined) {
                if(!$scope.actTrans.has($scope.txn_no)) {
                    $scope.actTrans.add($scope.txn_no);
                    var begTxn = [];
                    begTxn.txn_no = $scope.txn_no;
                    begTxn.txn_type = "Begin";
                    $scope.Array.push(begTxn);
                }
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = $scope.selectedType;
                txn.pageid = $scope.pageid;
                $scope.dp_buffer = sharedModels.dp_buffer;

                $scope.Array.push(txn);
                $scope.buffer.push(txn);

                // create a dirty page
                if (txn.txn_type=="Write"){
                    $scope.dirtypage.push(txn);
                    sharedModels.DirtyPage.push(txn);
                    sharedModels.dp_buffer.push(txn);
                    // console.log(sharedModels.dp_buffer);
                }

                // CLEAR TEXTBOX.
                $scope.txn_no = null;
                $scope.selectedType = null;
                $scope.pageid = null;

            }

            if ($scope.selectedType == "Checkpoint"){
                $scope.show_checkpoint = true;
                $scope.actArr = Array.from($scope.actTrans);
                $scope.selectedType = null;

            }

            if ($scope.txn_no != undefined && $scope.selectedType == "Commit"){

                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = $scope.selectedType;
                txn.pageid = "";
                $scope.Array.push(txn);
                $scope.dp_buffer = sharedModels.dp_buffer;

                //case 1: write method: randomly write
                if($scope.write_mode == 1){

                    // console.log($scope.dp_buffer,"dp_buffer");

                    $scope.PagetoWrite = [];
                    temp = [];
                    for (i=0; i<sharedModels.dp_buffer.length; i++){

                        if($scope.dp_buffer[i].txn_no != $scope.txn_no){
                            temp.push($scope.dp_buffer[i]);
                        }
                        else{
                            console.log($scope.dp_buffer[i].pageid,"pageid");
                            if (!$scope.PageInDisk.has($scope.dp_buffer[i].pageid)){
                                 $scope.PagetoWrite.push($scope.dp_buffer[i]);
                                 $scope.PageInDisk.add($scope.dp_buffer[i].pageid)
                            }
                        }
                    }
                    console.log($scope.PagetoWrite);
                    $scope.dp_buffer = temp;
                    $scope.count_in_disk += $scope.PagetoWrite.length;

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
                        var idx_list = new Set([]);
                        // console.log($scope.dirtypage.length);
                        while (idx_list.size<$scope.PagetoWrite.length){
                        // for (k = $scope.rest_idx.length; k--;){
                            randomIndex = Math.floor(Math.random()*$scope.rest_idx.length);
                            if(!idx_list.has(randomIndex)){
                                idx_list.add(randomIndex)
                            }
                        }
                        // console.log($scope.dirtypage);
                        var iterator1 = idx_list.values();
                        for(k=0; k<$scope.PagetoWrite.length; k++){

                            idx = iterator1.next().value;
                            i = $scope.rest_idx[idx][0];
                            j = $scope.rest_idx[idx][1];

                            $scope.AllRecords[i][j] = $scope.PagetoWrite[k].pageid;
                            console.log($scope.PagetoWrite[k]);
                        }
                        console.log($scope.AllRecords);
                    }
                    sharedModels.PageInDisk = $scope.PageInDisk;
                    // console.log(sharedModels.PageInDisk);
                    console.log($scope.PageInDisk);
                }

                $scope.txn_no = null;
                $scope.selectedType = null;

            }

    }
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

        $scope.select_1 = function () {
            $scope.write_mode = 1;
        }

        $scope.select_2 = function () {
            $scope.write_mode = 2;
            $scope.show_log = true;
        }

        $scope.flush = function () {
            console.log($scope.show_log);
            $scope.show_log = false;
            $scope.PagetoWrite = [];
            for (i=0; i<$scope.dirtypage.length; i++){
                if (!$scope.PageInDisk.has($scope.dirtypage[i].pageid)){
                         $scope.PagetoWrite.push($scope.dirtypage[i]);
                         $scope.PageInDisk.add($scope.dirtypage[i].pageid)
                }
            }

            $scope.count_in_disk += $scope.PagetoWrite.length;

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

                for(k=0; k<$scope.PagetoWrite.length; k++){

                    // idx = iterator1.next().value;
                    i = $scope.rest_idx[k][0];
                    j = $scope.rest_idx[k][1];

                    $scope.AllRecords[i][j] = $scope.PagetoWrite[k].pageid;
                    // console.log($scope.PagetoWrite[k]);
                }
                // console.log($scope.AllRecords);
            }
            // sharedModels.PageInDisk = $scope.PageInDisk;
            $scope.dirtypage = [];

        }

});



