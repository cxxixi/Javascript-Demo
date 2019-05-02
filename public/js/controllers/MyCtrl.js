var myApp = angular.module('MyCtrl', [])

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

myApp.controller('Controller', function($scope, sharedModels) {

        // array to be shared between controller.
        $scope.Array = sharedModels.Array;

        $scope.dp_buffer = [];
        $scope.id_set = sharedModels.id_set;
        $scope.choices = ['Write','Read','Commit'];
        var range = [];
        for(var i = 1; i <= 20; i++) {
          range.push(i);
        }
        $scope.txn_nos = range;
        $scope.pageids = range;
        $scope.PagetoWrite = [];
        //default is randomly write
        $scope.write_mode = 1;
        $scope.dirtypage = []
        $scope.show_log = false;
        $scope.show_buffer = true;


        $scope.count_in_disk = 4;
        //initialize records in the harddisk
        $scope.AllRecords = [[1,2,"","",""],["","","",9,""],["","",13,"",""],["","","","",""]];
        $scope.PageInDisk = new Set([1,2,9,13]);
        // the default apacity of harddisk is 20
        $scope.capacity = 20;

        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {

            //if buffer pool is not activated, activate it.
            if (!$scope.show_buffer){
                $scope.buffer = [];
                $scope.show_buffer = true;
            }
            $scope.buffer = [];
            // for Write and Read operation, all the three components are required.
            if ($scope.txn_no != undefined && $scope.selectedType != undefined && $scope.pageid != undefined) {
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = $scope.selectedType;
                txn.pageid = $scope.pageid;
                $scope.dp_buffer = sharedModels.dp_buffer;

                // add the record into array and bufferpool
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
            if ($scope.txn_no != undefined && $scope.selectedType == "Commit" && $scope.pageid == undefined){

                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = $scope.selectedType;
                txn.pageid = "";
                $scope.Array.push(txn);
                $scope.dp_buffer = sharedModels.dp_buffer;

                //case 1: write method: randomly write
                if($scope.write_mode == 1){

                    $scope.PagetoWrite = [];
                    temp = [];
                    for (i=0; i<sharedModels.dp_buffer.length; i++){

                        if($scope.dp_buffer[i].txn_no != $scope.txn_no){
                            temp.push($scope.dp_buffer[i]);
                        }
                        else{
                            // if the page is not in the harddisk, we add it in
                            if (!$scope.PageInDisk.has($scope.dp_buffer[i].pageid)){
                                 $scope.PagetoWrite.push($scope.dp_buffer[i]);
                                 $scope.PageInDisk.add($scope.dp_buffer[i].pageid)
                            }
                        }
                    }
                    $scope.dp_buffer = temp;
                    $scope.count_in_disk += $scope.PagetoWrite.length;

                    // if we still have space in harddisk
                    if ($scope.count_in_disk <= $scope.capacity){
                    //     //feasible
                        $scope.rest_idx = [];
                        for (k=0; k<$scope.capacity; k++){
                            // find all empty space in the harddisk
                            i = parseInt(k/5);
                            j = k-5*i;
                            if($scope.AllRecords[i][j]==""){
                                $scope.rest_idx.push([i,j]);
                            }
                        }
                        var idx_list = new Set([]);

                        //randomly pick out one spot for this page.
                        while (idx_list.size<$scope.PagetoWrite.length){
                            randomIndex = Math.floor(Math.random()*$scope.rest_idx.length);
                            if(!idx_list.has(randomIndex)){
                                idx_list.add(randomIndex)
                            }
                        }
                        var iterator1 = idx_list.values();
                        for(k=0; k<$scope.PagetoWrite.length; k++){

                            idx = iterator1.next().value;
                            i = $scope.rest_idx[idx][0];
                            j = $scope.rest_idx[idx][1];

                            $scope.AllRecords[i][j] = $scope.PagetoWrite[k].pageid;
                        }
                    }
                    sharedModels.PageInDisk = $scope.PageInDisk;
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

        //change the write mode to randomly write
        $scope.select_1 = function () {
            $scope.write_mode = 1;
        }

        // change the write mode to sequentially write
        $scope.select_2 = function () {
            $scope.write_mode = 2;
            $scope.show_log = true;
        }

        //flush the records to harddisk
        $scope.flush = function () {
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
                }
            }
            $scope.dirtypage = [];

        }

});
