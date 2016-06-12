angular.module('switchr').directive('footer', [
    'ChromeAPIService',
    function(ChromeAPIService) {
        return {
            templateUrl: 'dist/footer.directive.html',
            restrict: 'AE',
            // scope: {
            // },
            // link: function(scope, element) {
            // }
        };
    }]);
