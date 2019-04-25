var myApp = angular.module('LogCtrl', [])


myApp.controller('LogController', function($scope, AriesData) {

        $scope.Array = AriesData.Array;
        $scope.choices = ['Write', 'Commit', 'Checkpoint', 'Abort', 'End'];
        // $scope.show_checkpoint = false;
        $scope.actTrans = new Set([]); // active Transactions
        $scope.actArr = [];
        $scope.lsnArr = ["0","0","0","0"] // initialize the LSN of the 4 transactions
        $scope.LSN = 1;

        var range = [];
        var page_range = [];
        for(var i = 1; i <= 4; i++) {
          range.push(i);
          page_range.push(i);
        }
        $scope.txn_nos = range;
        page_range.push(5);
        page_range.push(6);
        $scope.pageids = page_range;
        var val_range = []
        for(var i = 1; i <= 20; i++) {
          val_range.push(i);
        }
        $scope.all_vals = val_range;

        // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
        $scope.addRow = function () {
            var ind;

            // if the input contains all the three info, then the request is valid
            if ($scope.txn_no != undefined && $scope.selectedType == 'Write'  && $scope.pageid != undefined
                && $scope.old_val != undefined && $scope.new_val != undefined) {
                if(!$scope.actTrans.has($scope.txn_no)) {
                    $scope.actTrans.add($scope.txn_no);
                    var begTxn = [];
                    begTxn.LSN = $scope.LSN;
                    $scope.LSN += 1;
                    begTxn.txn_no = $scope.txn_no;
                    begTxn.txn_type = "TXN-BEGIN";
                    $scope.Array.push(begTxn);
                }
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = "UPDATE"
                txn.pageid = $scope.pageid;
                txn.old_val = $scope.old_val;
                txn.new_val = $scope.new_val;

                //Find LSN of txn and add it to
                ind = parseInt($scope.txn_no, 10) - 1;
                txn.prev_LSN = $scope.lsnArr[ind];
                $scope.lsnArr[ind] = ($scope.Array.length + 1).toString();
                txn.LSN = $scope.LSN;
                $scope.LSN += 1;
                $scope.Array.push(txn);
            }

            // when taking checkpoint, txn_no and pageid should be null
            if ($scope.txn_no == null && $scope.selectedType == "Checkpoint" && $scope.pageid == null){
                var txn = [];
                txn.txn_no = "---";
                txn.txn_type = "CKPT-BEGIN";
                txn.pageid = "";
                txn.LSN = $scope.LSN;
                $scope.LSN += 1;
                $scope.Array.push(txn);

                var txn = [];
                txn.txn_no = "---";
                txn.txn_type = "CKPT-END";
                txn.pageid = "";
                txn.LSN = $scope.LSN;
                $scope.LSN += 1;
                $scope.Array.push(txn);


                $scope.show_checkpoint = true;
                $scope.actArr = Array.from($scope.actTrans);

            }

            // no pageid when committing a txn
            if ($scope.txn_no != undefined && $scope.selectedType == "Commit" && $scope.pageid == null){

                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = "TXN-COMMIT";
                txn.pageid = "";

                ind = parseInt($scope.txn_no, 10) - 1;
                txn.prev_LSN = $scope.lsnArr[ind];
                $scope.lsnArr[ind] = ($scope.Array.length + 1).toString();
                txn.LSN = $scope.LSN;
                $scope.LSN += 1;
                $scope.Array.push(txn);
                $scope.actTrans.delete($scope.txn_no);

            }

            // Only selecting Abort type can make the abortion request valid.
            if ($scope.txn_no != undefined && $scope.selectedType == "Abort" && $scope.pageid == null){
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = "ABORT";
                txn.pageid = "";

                ind = parseInt($scope.txn_no, 10) - 1;
                txn.prev_LSN = $scope.lsnArr[ind];
                $scope.lsnArr[ind] = ($scope.Array.length + 1).toString();
                txn.LSN = $scope.LSN;
                $scope.LSN += 1;
                $scope.Array.push(txn);
                // $scope.actTrans.delete($scope.txn_no);

            }

            if ($scope.txn_no != undefined && $scope.selectedType == "End" && $scope.pageid == null){
                var txn = [];
                txn.txn_no = $scope.txn_no;
                txn.txn_type = "TXN-END";
                txn.pageid = "";

                ind = parseInt($scope.txn_no, 10) - 1;
                txn.prev_LSN = $scope.lsnArr[ind];
                $scope.lsnArr[ind] = ($scope.Array.length + 1).toString();
                txn.LSN = $scope.LSN;
                $scope.LSN += 1;
                $scope.Array.push(txn);
                // $scope.actTrans.delete($scope.txn_no);

            }

        // CLEAR TEXTBOX.
        $scope.txn_no = null;
        $scope.selectedType = null;
        $scope.pageid = null;
        $scope.old_val = null;
        $scope.new_val = null;

    }

    $scope.crash = function(){

        var txn = [];
        txn.txn_type = "CRASH";
        $scope.Array.push(txn);

    }

});
