angular.module('GeekCtrl', []).controller('GeekController', function($scope) {
  $scope.names = [
  {label: "lock A"},
  {label: "lock B"}, 
  {label: "lock C"}, 
  {label: "unlock A", disabled: true}, 
  {label: "unlock B", disabled: true}, 
  {label: "unlock C", disabled: true}];
	$scope.tagline = 'The square root of life is pi!';	
	$scope.choicesA = [];
	$scope.addNewChoice = function(item) {
    var newItemNo = $scope.choicesA.length + 1;
    $scope.choicesA.push({
      'id': item.label
    });

    var foundIndex = $scope.names.findIndex(x => x.label == item.label);
    $scope.names[foundIndex].disabled = true

    if (item.label.startsWith("un")) {
      $scope.names.forEach((element, index) => {
        if (element.label.startsWith("lock")) {
          $scope.names[index].disabled = true;
        }
      });
    }

    var unlockVal = "un" + item.label
    var foundIndex = $scope.names.findIndex(x => x.label == unlockVal);
    $scope.names[foundIndex].disabled = false
    // for (var i in $scope.names) {
    //  if ($scope.names[i] == value) {
    //     $scope.names[i].disabled = true;
    //     break; //Stop this loop, we found it!
    //  }
    // }; 
    // $scope.selectedName.disabled = true;
  }
  $scope.removeChoice = function(ind) {
    $scope.choicesA.splice(ind,1);
  };
});