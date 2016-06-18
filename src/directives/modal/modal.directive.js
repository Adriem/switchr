angular.module('switchr').directive('modal', [
    function() {
        return {
            templateUrl: 'modal.directive.html',
            restrict: 'AE',
            transclude: {
                header: 'modalHeader',
                body: '?modalBody',
                footer: '?modalFooter'
            },
            scope: {
            },
            link: function(scope, element, attrs) {

                var denormalizedId = attrs.id
                        .replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                scope.hidden = true;
                scope.$on(denormalizedId + '-close', function() {
                    scope.hidden = true;
                });
                scope.$on(denormalizedId + '-open', function() {
                    scope.hidden = false;
                });
            }
        };
    }]);
