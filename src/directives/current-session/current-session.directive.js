angular.module('switchr').directive('currentSession', [
    'ChromeAPIService',
    function(ChromeAPIService) {
        return {
            templateUrl: 'dist/current-session.directive.html',
            restrict: 'AE',
            scope: {
                sessionData: '=',
                onClose: '&',
                onRestore: '&',
                onEdit: '&',
                onDelete: '&'
            },
            link: function(scope) {
                ChromeAPIService.getWindows().then(function(openedWindows) {
                    scope.$apply(function() {
                        scope.currentSession = new switchr.Session('', openedWindows);
                    });
                });
            }
        };
    }]);
