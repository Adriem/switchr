angular.module('switchr').controller('SessionListCtrl', [
    '$scope', 'SessionService', 'ChromeAPIService',
    function($scope, SessionService, ChromeAPIService) {

        function convertSessionList(sessionList) {
            var _convertedSessionList = []
            for (key in sessionList) {
                if (sessionList.hasOwnProperty(key)){
                    _convertedSessionList.push({
                        name: key,
                        windowList: sessionList[key],
                        windowCount: sessionList[key].length,
                        tabCount: sessionList[key].reduce(function(accum, value) {
                            return accum + value.length;
                        }, 0)
                    });
                }
            }
            return _convertedSessionList;
        }

        function loadSessions() {
            return SessionService.getSessions()
                .then(function(sessions) {
                    $scope.$apply(function() {
                        $scope.sessionList = convertSessionList(sessions);
                    });
                    return SessionService.getActiveSession();
                })
                .then(function(activeSession) {
                    if (activeSession) {
                        $scope.$apply(function() {
                            var _aux = {};
                            _aux[activeSession.name] = activeSession.data;
                            $scope.activeSession = convertSessionList(_aux)[0];
                        });
                    } else {
                        return ChromeAPIService.getWindows()
                            .then(function(windows) {
                                var windowList = windows.map(function(_window) {
                                    return _window.tabs.map(function(_tab) {
                                        return _tab.url;
                                    });
                                });
                                $scope.$apply(function() {
                                    $scope.activeSession = convertSessionList({
                                        "Unsaved session*": windowList
                                    })[0];
                                });
                            });
                    }
                })
                .catch(function(err) {console.error(err); });
        }

        $scope.saveSession = function(name) {
            ChromeAPIService.getWindows()
            .then(function(windows) {
                var windowList = windows.map(function(_window) {
                    return _window.tabs.map(function(_tab) {
                        return _tab.url;
                    });
                });
                return SessionService.createSession(name, windowList);
            })
            .then(function(sessions) {
                return loadSessions();
            });
        }

        $scope.restoreSession = function(name) {
            return Promise.all([
                SessionService.getSession(name),
                ChromeAPIService.getWindows(),
                SessionService.activateSession(name)
            ]).then(function(results) {
                var accum = [];
                for (var i = 0; i < results[0].length; i++) {
                    accum.push(ChromeAPIService.createWindow(results[0][i]));
                }
                return Promise.all(accum).then(function() {
                    return ChromeAPIService.closeWindows(results[1]);
                });
            });
        }

        $scope.closeSession = function() {
            return Promise.all([
                ChromeAPIService.getWindows(),
                SessionService.deactivateSession()
            ]).then(function(results) {
                return ChromeAPIService.createWindow().then(function() {
                    return ChromeAPIService.closeWindows(results[0]);
                });
            });
        }

        $scope.removeSession = function(name) {
            return SessionService.removeSession(name)
            .then(function(sessions) {
                return loadSessions();
            });
        }

        loadSessions();
    }]);
