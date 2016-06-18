angular.module('switchr').directive('session', [
    function() {
        return {
            templateUrl: 'session.directive.html',
            restrict: 'AE',
            scope: {
                name: '=',
                info: '@',
                status: '@',
                onLoad: '&',
                onEdit: '&',
                onDelete: '&'
            },
            link: function(scope, element, attrs) {
                scope.expanded = false;
                scope.load = function() {
                    if (!scope.expanded) scope.onLoad({ name: scope.name });
                };
                scope.editButtonDisabled = typeof attrs.onEdit === 'undefined';
                scope.deleteButtonDisabled = typeof attrs.onDelete === 'undefined';
                element.mouseleave(function() {
                    scope.$apply(function() {
                        scope.expanded = false;
                    });
                });
            }
        };
    }]);
