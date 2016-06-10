angular.module('switchr').directive('savedSession', [
    'SessionService',
    function(ChromeAPIService) {
        return {
            templateUrl: 'dist/saved-session.directive.html',
            restrict: 'AE',
            scope: {
                name: '=',
                info: '=',
                windowList: '=',
                onLoad: '&',
                onSave: '&',
                onDelete: '&',
                onRemoveWindow: '&'
            },
            link: function(scope, element) {
                scope.expanded = false;
            }
        };
    }]);
