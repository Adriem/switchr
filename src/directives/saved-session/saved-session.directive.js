angular.module('switchr').directive('savedSession', [
    function() {
        return {
            templateUrl: 'dist/saved-session.directive.html',
            restrict: 'AE',
            scope: {
                name: '=',
                info: '=',
                onLoad: '&',
                onSave: '&',
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
