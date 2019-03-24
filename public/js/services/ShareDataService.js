angular.module('NerdService', []).service("greeting", function Greeting(){
    var greeting = this;

    greeting.message = "default";
})