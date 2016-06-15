angular.module('switchr').controller('SessionListCtrl', [
    '$scope', 'SessionService', 'ChromeAPIService',
    function($scope, SessionService, ChromeAPIService) {

        function convertSession(session) {
            if (session) return {
                name: session.name,
                windowList: session.windowList,
                windowCount: session.windowList.length,
                tabCount: session.windowList.reduce(function(accum, value) {
                    return accum + value.length;
                }, 0)
            };
            else return null;
        }
        function convertSessionList(sessionList) {
            var _convertedSessionList = [];
            for (var i = 0; i < sessionList.length; i++) {
                _convertedSessionList.push(convertSession(sessionList[i]));
            }
            return _convertedSessionList;
        }
        function loadSessions() {
            return SessionService.getAllSessions()
                .then(function(state) {
                    $scope.$apply(function() {
                        $scope.sessionList = state.sessionList;
                        $scope.activeSession = state.activeSession;
                    });
                })
                .catch(function(err) { console.error(err); });
        };

        // $scope.saveSession = function(name) {
            // ChromeAPIService.getWindows()
            // .then(function(windows) {
                // var windowList = windows.map(function(_window) {
                    // return _window.tabs.map(function(_tab) {
                        // return _tab.url;
                    // });
                // });
                // return SessionService.createSession(name, windowList);
            // })
            // .then(function(sessions) {
                // return loadSessions();
            // });
        // };

        // $scope.createSession = function(name) {
            // ChromeAPIService.getWindows()
            // .then(function(windows) {
                // var windowList = windows.map(function(_window) {
                    // return _window.tabs.map(function(_tab) {
                        // return _tab.url;
                    // });
                // });
                // return SessionService.createSession(name, windowList);
            // })
            // .then(function(sessions) {
                // return loadSessions();
            // })
            // .catch(function(error) {
                // console.log(error);
            // });
        // };

        $scope.restoreSession = function(name) {
            return SessionService.loadSession(name);
        };
        $scope.closeSession = function() {
            return SessionService.closeSession();
        };
        $scope.renameSession = function(oldName, newName) {
            return SessionService.renameSession(oldName, newName)
                .then(function(sessions) {
                    $scope.closeModal('rename-modal');
                    return loadSessions();
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        $scope.removeSession = function(name) {
            return SessionService.removeSession(name)
                .then(function(sessions) {
                    $scope.closeModal('delete-modal');
                    return loadSessions();
                })
                .catch(function(error) {
                    console.log(error);
                });
        };

        // Modal control
        $scope.openModal = function(modalId) {
            $scope.$broadcast(modalId + '-open');
        };
        $scope.closeModal = function(modalId) {
            $scope.$broadcast(modalId + '-close');
            if ($scope.modalData) $scope.modalData = null;
        };

        // Action specific modals
        // $scope.openSaveModal = function() {
            // $scope.openModal('save-modal');
        // };
        $scope.openRenameModal = function(name) {
            $scope.modalData = {
                oldName: name,
                newName: name,
                activeSession: $scope.activeSession
                        && name == $scope.activeSession.name
            };
            $scope.openModal('rename-modal');
        };
        $scope.openDeleteModal = function(name) {
            $scope.modalData = { name: name };
            $scope.openModal('delete-modal');
        };
        $scope.afterSave = function() {
            loadSessions();
        };

        // Load session on controller load
        loadSessions();

    }]);
