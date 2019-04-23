angular.module('AriesService', [])
.service('AriesData', [function () {

    // Shared Model Data
    this.Array = [];
    // this.id_set = new Set([]);
    // this.DirtyPage = [];
    // this.dp_buffer = [];
    // this.PageInDisk = new Set(["1","2","9","13"]);

}]);

// angular.module('LogCtrl', []).filter("unique", function() {
//   // we will return a function which will take in a collection
//   // and a keyname
//   return function(collection, keyname) {
//     // we define our output and keys array;
//     var output = [],
//       keys = [];

//     angular.forEach(collection, function(item) {
//       // we check to see whether our object exists
//       var key = item[keyname];
//       // if it's not already part of our keys array
//       if (keys.indexOf(key) === -1) {
//         // add it to our keys array
//         keys.push(key);
//         // push this item to our final output array
//         output.push(item);
//       }
//     });

//     return output;
//   };
// });