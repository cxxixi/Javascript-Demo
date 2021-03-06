var myApp = angular.module('BufCtrl', [])

myApp.service('sharedModels', [function () {

    // Shared Models
    this.Array = [];
    this.bufArray = [];
    this.clockInd = 0;
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

myApp.controller('BufController', function($scope, sharedModels) {

        $scope.Array = sharedModels.Array;
        $scope.BufferArray = sharedModels.bufArray;
        $scope.firstRW = true; //used to not increment clock on very first read

        $scope.dp_buffer = [];
        $scope.id_set = sharedModels.id_set;
        $scope.choices = ['Read', 'Write', 'Flush'];
        $scope.PagetoWrite = [];
        $scope.write_nos = ["A", "B", "C", "D", "E"];
        //default is randomly write
        $scope.write_no = "";
        $scope.write_mode = 1;
        $scope.dirtypage = [];
        $scope.show_log = false;
        $scope.show_buffer = true;
        $scope.show_checkpoint = false;
        $scope.actTrans = new Set([]); // active Transactions
        $scope.actArr = [];
        $scope.lsnArr = ["0","0","0","0"] // initialize the LSN of the 4 transactions

        //Clock information
        $scope.clockHand = 0;
        $scope.clockInd = $scope.clockHand % 4;

        //Each index is one of the four frames
        $scope.pageArr = ["0","0","0","0"];
        $scope.valArr = ["","","",""];
        $scope.dirtyArr = [false, false, false, false];
        $scope.refArr = [false, false, false, false];

        $scope.lfuArr = [0,0,0,0];
        $scope.maxOrd = [0,1,2,3];

        $scope.lruArr = [0,1,2,3];

        $scope.bufSize = 0;

        $scope.ref = -1;



        $scope.count_in_disk = 4;
        $scope.AllRecords = [["1","2","","",""],["","","","9",""],["","","13","",""],["","","","",""]];
        $scope.AllValues = [["A","B","","",""],["","","","C",""],["","","D","",""],["","","","",""]];
        $scope.PageInDisk = new Set(["1","2","9","13"]);
        // $scope.PageInDisk = sharedModels.PageInDisk;
        $scope.capacity = 20;

        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {
            var ind;
            $scope.ref = -1;

            if (!$scope.show_buffer) {
                $scope.buffer = [];
                $scope.show_buffer = true;
            }

            $scope.buffer = [];

            if (($scope.selectedType == "Write" || $scope.selectedType == "Read") && $scope.pageid != undefined) {

                var txn = [];
                txn.write_no = $scope.write_no;
                txn.txn_type = $scope.selectedType;
                txn.pageid = $scope.pageid;

                $scope.dp_buffer = sharedModels.dp_buffer;

                $scope.Array.push(txn);
                $scope.buffer.push(txn);

                // Check to see if Page is in buffer, if so access info from buffer pool, else add to pool
                var bufi = 0;
                var stored = false;
                while (bufi < 4 && !stored) {
                    if ($scope.pageid == $scope.pageArr[bufi]) {
                        stored = true; //page is already in buffer
                    } else {
                        bufi++;
                    }
                }

                //Either change the data in buffer or add page to buffer
                if (stored) {
                    if ($scope.write_mode == 1) {
                        console.log("Located at: " + bufi);
                        if (txn.txn_type == "Write") {
                            $scope.valArr[bufi] = txn.write_no;
                            $scope.dirtyArr[bufi] = true;
                        }
                        $scope.refArr[bufi] = true;
                    } else if ($scope.write_mode == 2) {
                        var loc = 0;
                        while (loc < 3) {
                            if ($scope.maxOrd[loc] == bufi) {
                                break;
                            }
                            loc++;
                        }
                        $scope.ref = loc;
                        console.log("Located at: " + loc);
                        if (txn.txn_type == "Write") {
                            $scope.valArr[loc] = txn.write_no;
                            $scope.dirtyArr[loc] = true;
                        }
                        $scope.refArr[loc] = true;
                        var temp;
                        var tempVal;
                        $scope.lfuArr[loc] = $scope.lfuArr[loc] + 1;
                        for (j = 0; j < 3; j++) {
                            for (i = 3; i > 0; i--) {
                                if ($scope.lfuArr[i] > $scope.lfuArr[i-1]) {
                                    temp = $scope.lfuArr[i];
                                    $scope.lfuArr[i] = $scope.lfuArr[i-1];
                                    $scope.lfuArr[i-1] = temp;

                                    tempVal = $scope.maxOrd[i];
                                    $scope.maxOrd[i] = $scope.maxOrd[i-1];
                                    $scope.maxOrd[i-1] = tempVal;
                                }
                            }
                        }
                        $scope.ref = 0;
                        while (loc != $scope.maxOrd[$scope.ref]) {
                            $scope.ref = $scope.ref + 1;
                        }
                    } else {
                        if (txn.txn_type == "Write") {
                            $scope.valArr[bufi] = txn.write_no;
                            $scope.dirtyArr[bufi] = true;
                        }
                        var loc = 0;
                        while (loc < 3) {
                            if ($scope.lruArr[loc] == bufi) {
                                break;
                            }
                            loc++;
                        }
                        var frame = $scope.lruArr[loc];
                        for (i = loc; i > 0; i--) {
                            $scope.lruArr[i] = $scope.lruArr[i-1];
                        }
                        $scope.lruArr[0] = frame;
                        $scope.ref = 0;
                    }
                } else {
                    //CLOCK MANAGEMENT
                    if ($scope.write_mode == 1) {
                        //Check to see what needs to leave the buffer pool
                        if ($scope.firstRW) {
                            $scope.firstRW = false;
                        } else {
                            $scope.clockHand = $scope.clockHand + 1;
                        }

                        var cont = true;
                        while (cont) {
                            $scope.clockInd = $scope.clockHand % 4;
                            m = 90 * $scope.clockHand;
                            var v = 'rotate(' + m + ', 70, 70)';
                            document.getElementById('m-hand').setAttribute('transform', v);
                            if (!$scope.refArr[$scope.clockInd]) {
                                if ($scope.dirtyArr[$scope.clockInd]) { //Write dirty page to disk
                                    $scope.PageInDisk.add($scope.pageid);
                                    var indPos = parseInt($scope.pageArr[$scope.clockInd], 10) - 1;
                                    var ii = Math.floor(indPos / 5);
                                    var jj = indPos % 5;
                                    console.log("di: " + ii);
                                    console.log("dj: " + jj);
                                    $scope.AllRecords[ii][jj] = $scope.pageArr[$scope.clockInd];
                                    $scope.AllValues[ii][jj] = $scope.valArr[$scope.clockInd];

                                    console.log("newPage: " + $scope.AllRecords[ii][jj]);
                                    console.log("newVal: " + $scope.AllValues[ii][jj]);

                                }

                                $scope.pageArr[$scope.clockInd] = $scope.pageid;
                                if (txn.txn_type == "Write") {
                                    $scope.valArr[$scope.clockInd] = $scope.write_no;
                                    $scope.dirtyArr[$scope.clockInd] = true;
                                } else { //read from disk
                                    var indPosa = parseInt($scope.pageArr[$scope.clockInd], 10) - 1;
                                    var iii = Math.floor(indPosa / 5);
                                    var jjj = indPosa % 5;
                                    console.log("i: " + iii);
                                    console.log("j: " + jjj);
                                    $scope.valArr[$scope.clockInd] = $scope.AllValues[iii][jjj];
                                    $scope.dirtyArr[$scope.clockInd] = false;
                                }
                                $scope.refArr[$scope.clockInd] = false;
                                cont = false;
                            } else {
                                $scope.refArr[$scope.clockInd] = false;
                                $scope.clockHand = $scope.clockHand + 1;
                                console.log($scope.clockHand);
                            }
                        }
                    } else if ($scope.write_mode == 2) {
                        if ($scope.bufSize < 4) {
                            $scope.pageArr[$scope.bufSize] = $scope.pageid;
                            if (txn.txn_type == "Write") {
                                $scope.valArr[$scope.bufSize] = $scope.write_no;
                                $scope.dirtyArr[$scope.bufSize] = true;
                            } else { //read from disk
                                var indPosa = parseInt($scope.pageArr[$scope.bufSize], 10) - 1;
                                var iii = Math.floor(indPosa / 5);
                                var jjj = indPosa % 5;
                                console.log("i: " + iii);
                                console.log("j: " + jjj);
                                $scope.valArr[$scope.bufSize] = $scope.AllValues[iii][jjj];
                                $scope.dirtyArr[$scope.bufSize] = false;
                            }
                            $scope.lfuArr[$scope.bufSize] = 1;
                            $scope.bufSize = $scope.bufSize + 1;

                        } else {
                           if ($scope.dirtyArr[$scope.maxOrd[3]]) { //Write dirty page to disk
                                $scope.PageInDisk.add($scope.pageid);
                                var indPos = parseInt($scope.pageArr[$scope.maxOrd[3]], 10) - 1;
                                var ii = Math.floor(indPos / 5);
                                var jj = indPos % 5;
                                console.log("di: " + ii);
                                console.log("dj: " + jj);
                                $scope.AllRecords[ii][jj] = $scope.pageArr[$scope.maxOrd[3]];
                                $scope.AllValues[ii][jj] = $scope.valArr[$scope.maxOrd[3]];

                                console.log("newPage: " + $scope.AllRecords[ii][jj]);
                                console.log("newVal: " + $scope.AllValues[ii][jj]);

                            }

                            $scope.pageArr[$scope.maxOrd[3]] = $scope.pageid;
                            if (txn.txn_type == "Write") {
                                $scope.valArr[$scope.maxOrd[3]] = $scope.write_no;
                                $scope.dirtyArr[$scope.maxOrd[3]] = true;
                            } else { //read from disk
                                var indPosa = parseInt($scope.pageArr[$scope.maxOrd[3]], 10) - 1;
                                var iii = Math.floor(indPosa / 5);
                                var jjj = indPosa % 5;
                                console.log("i: " + iii);
                                console.log("j: " + jjj);
                                $scope.valArr[$scope.maxOrd[3]] = $scope.AllValues[iii][jjj];
                                $scope.dirtyArr[$scope.maxOrd[3]] = false;
                            }
                            $scope.lfuArr[$scope.maxOrd[3]] = 1;
                        }
                    } else { //write_mode == 3
                        if ($scope.bufSize < 4) {
                            $scope.pageArr[$scope.bufSize] = $scope.pageid;
                            if (txn.txn_type == "Write") {
                                $scope.valArr[$scope.bufSize] = $scope.write_no;
                                $scope.dirtyArr[$scope.bufSize] = true;
                            } else { //read from disk
                                var indPosa = parseInt($scope.pageArr[$scope.bufSize], 10) - 1;
                                var iii = Math.floor(indPosa / 5);
                                var jjj = indPosa % 5;
                                console.log("i: " + iii);
                                console.log("j: " + jjj);
                                $scope.valArr[$scope.bufSize] = $scope.AllValues[iii][jjj];
                                $scope.dirtyArr[$scope.bufSize] = false;
                            }
                            var frame = $scope.lruArr[$scope.bufSize];
                            for (i = $scope.bufSize; i > 0; i--) {
                                $scope.lruArr[i] = $scope.lruArr[i-1];
                            }
                            $scope.lruArr[0] = frame;
                            $scope.bufSize = $scope.bufSize + 1;
                        } else {
                           if ($scope.dirtyArr[$scope.lruArr[3]]) { //Write dirty page to disk
                                $scope.PageInDisk.add($scope.pageid);
                                var indPos = parseInt($scope.pageArr[$scope.lruArr[3]], 10) - 1;
                                var ii = Math.floor(indPos / 5);
                                var jj = indPos % 5;
                                console.log("di: " + ii);
                                console.log("dj: " + jj);
                                $scope.AllRecords[ii][jj] = $scope.pageArr[$scope.lruArr[3]];
                                $scope.AllValues[ii][jj] = $scope.valArr[$scope.lruArr[3]];
                                console.log("newPage: " + $scope.AllRecords[ii][jj]);
                                console.log("newVal: " + $scope.AllValues[ii][jj]);
                            }

                            $scope.pageArr[$scope.lruArr[3]] = $scope.pageid;
                            if (txn.txn_type == "Write") {
                                $scope.valArr[$scope.lruArr[3]] = $scope.write_no;
                                $scope.dirtyArr[$scope.lruArr[3]] = true;
                            } else { //read from disk
                                var indPosa = parseInt($scope.pageArr[$scope.lruArr[3]], 10) - 1;
                                var iii = Math.floor(indPosa / 5);
                                var jjj = indPosa % 5;
                                console.log("i: " + iii);
                                console.log("j: " + jjj);
                                $scope.valArr[$scope.lruArr[3]] = $scope.AllValues[iii][jjj];
                                $scope.dirtyArr[$scope.lruArr[3]] = false;
                            }
                            var frame = $scope.lruArr[3];
                            for (i = 3; i > 0; i--) {
                                $scope.lruArr[i] = $scope.lruArr[i-1];
                            }
                            $scope.lruArr[0] = frame;
                        }
                    }
                }

                // create a dirty page
                if (txn.txn_type=="Write"){
                    $scope.dirtypage.push(txn);
                    sharedModels.DirtyPage.push(txn);
                    sharedModels.dp_buffer.push(txn);
                    // console.log(sharedModels.dp_buffer);
                }

                // CLEAR TEXTBOX.
                $scope.write_no = null;
                $scope.selectedType = null;
                $scope.pageid = null;

            }


            if ($scope.selectedType == "Flush") {
                var txn = [];
                txn.txn_type = $scope.selectedType;
                $scope.Array.push(txn);



                for (ind = 0; ind < 4; ind++) {
                    if ($scope.dirtyArr[ind]) { //Write dirty page to disk
                        $scope.PageInDisk.add($scope.pageArr[ind]);
                        var indPos = parseInt($scope.pageArr[ind], 10) - 1;
                        var ii = Math.floor(indPos / 5);
                        var jj = indPos % 5;
                        console.log("di: " + ii);
                        console.log("dj: " + jj);
                        $scope.AllRecords[ii][jj] = $scope.pageArr[ind];
                        $scope.AllValues[ii][jj] = $scope.valArr[ind];

                        console.log("newPage: " + $scope.AllRecords[ii][jj]);
                        console.log("newVal: " + $scope.AllValues[ii][jj]);

                    }

                    $scope.pageArr[ind] = "0";
                    $scope.valArr[ind] = "";
                    $scope.dirtyArr[ind] = false;
                    $scope.refArr[ind] = false;
                }
                $scope.lruArr = [0,1,2,3];
                $scope.bufSize = 0;
                $scope.selectedType = null;
            }



        }

        $scope.select_1 = function () {
            $scope.write_mode = 1;
        }

        $scope.select_2 = function () {
            $scope.write_mode = 2;
        }

        $scope.select_3 = function () {
            $scope.write_mode = 3;
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
                }
            }
            $scope.dirtypage = [];

        }

        $scope.clock = function () {

            $scope.clockHand = $scope.clockHand + 1;
            $scope.clockInd = $scope.clockHand % 4;
            sharedModels.clockInd = $scope.clockInd;
            m = 90 * $scope.clockHand;
            var v = 'rotate(' + m + ', 70, 70)';
            document.getElementById('m-hand').setAttribute('transform', v);



        }

});
