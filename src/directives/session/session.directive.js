angular.module('switchr').directive('session', [
    function() {
        return {
            templateUrl: 'dist/session.directive.html',
            restrict: 'AE',
            scope: {
                name: '=',
                info: '=',
                status: '@',
                onLoad: '&',
                onEdit: '&',
                onDelete: '&'
            },
            link: function(scope, element) {
                scope.expanded = false;
                scope.load = function() {
                    if (!scope.expanded) scope.onLoad({ name: scope.name });
                }
                element.mouseleave(function() {
                    scope.$apply(function() {
                        scope.expanded = false;
                    })
                })
            }
        };
    }]);
