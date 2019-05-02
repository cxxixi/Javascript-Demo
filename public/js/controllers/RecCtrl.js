var myApp = angular.module('RecCtrl', [])


myApp.controller('RecController', function($scope, AriesData) {

        $scope.Array = AriesData.Array;

        $scope.DirtyPage = new Set([]);
        $scope.recLSN = []
        var tmp = [];
        for (var i=0; i<$scope.Array.length; i++){
            var txn = [];
            txn.LSN = $scope.Array[i].LSN;
            txn.txn_no = $scope.Array[i].txn_no;
            txn.prev_LSN = $scope.Array[i].prev_LSN;
            txn.txn_type = $scope.Array[i].txn_type;
            txn.pageid = $scope.Array[i].pageid;
            txn.old_val = $scope.Array[i].old_val;
            txn.new_val = $scope.Array[i].new_val;
            txn.Selected = false;
            tmp.push(txn);
        }
        $scope.Array = tmp;
        $scope.show_analysis = false;
        $scope.SelectedArr = [];

        // initialize active transaction table
        $scope.actArr = [
        {   "txn_no": 1,
            "LastLSN": null,
            "status": ""
        },
        {   "txn_no": 2,
            "LastLSN": null,
            "status": ""
        },
        {   "txn_no": 3,
            "LastLSN": null,
            "status": ""
        },
        {   "txn_no": 4,
            "LastLSN": null,
            "status": ""
        }];


    $scope.addRow = function (txn) {

        txn.Selected = true;
        $scope.SelectedArr.push(txn);

        if(txn.txn_no in [1,2,3,4]){
            $scope.actArr[txn.txn_no-1].LastLSN = txn.LSN;
        }

        if (txn.txn_type == 'UPDATE') {

            $scope.actArr[txn.txn_no-1].status = "U";
            if(!$scope.DirtyPage.has(txn.pageid)){
                $scope.DirtyPage.add(txn.pageid);
                $scope.recLSN.push(txn);

            }
        }
            if (txn.txn_type == "TXN-COMMIT"){
                // change the status of the txn to "C"
                $scope.actArr[txn.txn_no-1].status = "C";

            }
            // eliminate the txn from the active transaction table
            if (txn.txn_type == "TXN-END"){
                $scope.actArr[txn.txn_no-1].status = "";

            }

    };

    // to select all the records in the WAL
    $scope.select_all = function() {

        if($scope.selectall == true){
            $scope.selectall = false;
            $scope.SelectedArr = [];
            for (var i=0; i<4; i++){
                $scope.actArr[i].status = "";
            }
            $scope.recLSN = [];

            for (var i=0; i<$scope.Array.length; i++){
                $scope.Array[i].Selected = false;
        }

        } 
        else{
            $scope.selectall = true;
        }

        if($scope.selectall == true){
            for (var i=0; i<$scope.Array.length; i++){
                $scope.addRow($scope.Array[i])
        }
        }
        

    }

    $scope.analysis = function () {
        // CLEAR TEXTBOX.
        for (var i=0; i<$scope.Array.length; i++){
            $scope.Array[i].Selected = false;
        }

        //activate analysis phase and deactivate redo and undo phase
        $scope.show_analysis = true;
        $scope.show_redo = false;
        $scope.show_undo = false;
        for (var i=0; i<4; i++){
            $scope.actArr[i].status = "";
        }
        $scope.recLSN = [];
    }


    $scope.redo = function () {

        $scope.show_analysis = false;
        $scope.show_redo = true;
        $scope.show_undo = false;
    }

     $scope.undo = function () {
 
        $scope.show_error = false;
        $scope.show_analysis = false;
        $scope.show_redo = false;
        $scope.show_undo = true;
    }



    $scope.redo_txn = function (txn){

        $scope.show_error = false;
        var prev_LSN = null;
        var select_txn = txn.txn_no;
        var ArrLength = $scope.Array.length;

        //if the select record in ATT has status "C"
        if($scope.actArr[txn.txn_no-1].status=="C"){

            var txn = [];
            txn.txn_type = "TXN-END";
            txn.txn_no = select_txn;

            for (var i=1; i<$scope.Array.length; i++){
                if($scope.Array[i].txn_type=="TXN-COMMIT" && $scope.Array[i].txn_no == select_txn){
                    txn.prev_LSN = i+1;
                }
            }
            $scope.Array.push(txn);
            $scope.actArr[select_txn-1].status = "";
        }
        // otherwise, show error message
        else{
            $scope.show_error = true;

        }
    }

    $scope.undo_txn = function (txn) {

        for (var i=0; i<$scope.Array.length; i++){
            $scope.Array[i].Selected = false;
        }

        var prev_LSN = null;
        var select_txn = txn.txn_no;
        var ArrLength = $scope.Array.length;

        //undo those txns with status "U"
        if($scope.actArr[txn.txn_no-1].status=="U"){

            // check the WAL in reversed way, to add CLR operation.
            for (var i=$scope.Array.length-1; i>0; i--){

                if($scope.Array[i].txn_type=="UPDATE" && $scope.Array[i].txn_no == select_txn){
                    var txn = [];
                    txn.txn_type = "CLR";
                    txn.txn_no = select_txn;

                    txn.prev_LSN = $scope.Array[i].LSN;
                    txn.UndoNextLSN = $scope.Array[i].prev_LSN;

                    ArrLength += 1;
                    txn.LSN = ArrLength;
                    txn.old_val = $scope.Array[i].new_val;
                    txn.new_val = $scope.Array[i].old_val;
                    $scope.Array.push(txn);
                    $scope.actArr[select_txn-1].status = "";
                }
            }
            var txn = [];
            txn.txn_type = "TXN-END";
            txn.txn_no = select_txn;
            txn.prev_LSN = ArrLength;
            $scope.Array.push(txn);
        }

    }

});
