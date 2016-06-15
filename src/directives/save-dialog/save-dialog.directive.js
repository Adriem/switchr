angular.module('switchr').directive('saveControl', [
    function() {
        return {
            templateUrl: 'dist/save-dialog.directive.html',
            restrict: 'AE',
            scope: {
                sessionList: '=',
                activeSession: '=',
                afterSave: '&'
            },
            link: function(scope, element) {
                scope.$on('save-modal-open', function() {
                    scope.saveDestination = {
                        existingSession: scope.activeSession
                                ? scope.activeSession.name : null
                    };
                });
                scope.open = function() {
                    scope.$broadcast('save-modal-open');
                }
                scope.close = function() {
                    scope.$broadcast('save-modal-close');
                }
            },
            controller: [
                '$scope', 'ChromeAPIService', 'SessionService',
                function($scope, ChromeAPIService, SessionService) {
                    $scope.save = function() {
                        ChromeAPIService.getWindows()
                        .then(function(openedWindows) {
                            var sessionName =
                                $scope.saveDestination.existingSession
                                || $scope.saveDestination.newSession;
                            var currentSession =
                                new switchr.Session(sessionName, openedWindows);
                            if ($scope.saveDestination.existingSession) {
                                return SessionService.saveSession(currentSession);
                            } else {
                                return SessionService.createSession(currentSession);
                            }
                        })
                        .then(function() {
                            $scope.close();
                            $scope.afterSave();
                        })
                        .catch(function(error) {
                            console.error(error);
                        });
                    };
                }
            ]
        };
    }]);
