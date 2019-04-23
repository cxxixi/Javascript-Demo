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

            // $scope.actArr[txn.txn_no-1].status = "U";
            // if(!$scope.actTrans.has(txn.txn_no)) {
            //     $scope.actTrans.add(txn.txn_no);
            // }
        }
            // when taking checkpoint, txn_no and pageid should be null
            // if (txn.txn_type == "CKPT-END"){

            // //     $scope.show_checkpoint = true;
            //     $scope.actArr = Array.from($scope.actTrans);

            // }

            // no pageid when committing a txn
            if (txn.txn_type == "TXN-COMMIT"){

                $scope.actArr[txn.txn_no-1].status = "C";
                // $scope.actTrans.delete(txn.txn_no);

            }
            // Only selecting Abort type can make the abortion request valid.
            if (txn.txn_type == "TXN-END"){
                $scope.actArr[txn.txn_no-1].status = "";
            //     // $scope.actTrans.delete($scope.txn_no);

            }

    };

    $scope.analysis = function () {
        // CLEAR TEXTBOX.
        for (var i=0; i<$scope.Array.length; i++){
            $scope.Array[i].Selected = false;
        }
            
        $scope.show_analysis = true;
        $scope.show_redo = false;
        $scope.show_undo = false;
        $scope.actTrans = new Set([]); // active Transactions

    }


    $scope.redo = function () {
        // CLEAR TEXTBOX.
        // for (var i=0; i<$scope.Array.length; i++){
        //     $scope.Array[i].Selected = false;
        // }
        $scope.show_analysis = false;
        $scope.show_redo = true;
        $scope.show_undo = false;
    }

     $scope.undo = function () {
        // CLEAR TEXTBOX.
        // for (var i=0; i<$scope.Array.length; i++){
        //     $scope.Array[i].Selected = false;
        // }
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
        else{
            $scope.show_error = true;

        }    
    }

    $scope.undo_txn = function (txn) {
        // CLEAR TEXTBOX.
        for (var i=0; i<$scope.Array.length; i++){
            $scope.Array[i].Selected = false;
        }

        var prev_LSN = null;
        var select_txn = txn.txn_no;
        var ArrLength = $scope.Array.length;

        if($scope.actArr[txn.txn_no-1].status=="U"){
            
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






