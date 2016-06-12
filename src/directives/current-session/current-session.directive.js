angular.module('switchr').directive('currentSession', [
    function() {
        return {
            templateUrl: 'dist/current-session.directive.html',
            restrict: 'AE',
            scope: {
                activeSession: '=',
                onCloseSession: '&',
                onRestoreSession: '&',
                onSaveSession: '&',
                onRemoveSession: '&'
            },
            link: function(scope, element) {
                scope.saveMenuExpanded = false;
                scope.editTitle = false;
            }
        };
    }]);
