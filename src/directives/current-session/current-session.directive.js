angular.module('switchr').directive('currentSession', [
    function() {
        return {
            templateUrl: 'dist/current-session.directive.html',
            restrict: 'AE',
            scope: {
                name: '=',
                info: '=',
                status: '@',
                onClose: '&',
                onRestore: '&',
                onEdit: '&',
                onDelete: '&'
            },
            link: function(scope, element) {
            }
        };
    }]);
