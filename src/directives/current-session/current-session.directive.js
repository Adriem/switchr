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
            link: function(scope, element) {
                ChromeAPIService.getWindows().then(function(openedWindows) {
                    var currentSession = new switchr.Session('', openedWindows);
                    scope.$apply(function() {
                        if (!scope.sessionData) {
                            scope.info = '- - -';
                            scope.status = currentSession.getWindowCount()
                                    + ' window(s) - '
                                    + currentSession.getTabCount()
                                    + ' tab(s) opened';
                        } else {
                            scope.info = scope.sessionData.getWindowCount()
                                    + ' window(s) - '
                                    + scope.sessionData.getTabCount()
                                    + ' tab(s) saved';
                            scope.status = currentSession
                                    .checkForChanges(scope.sessionData)
                                    ? 'Unsaved changes' : 'Nothing saved'
                        }
                    });
                })
            }
        };
    }]);
