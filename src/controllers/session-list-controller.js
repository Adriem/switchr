angular.module('switchr').controller('SessionListCtrl', [
    '$scope', 'SessionService', 'ChromeAPIService',
    function($scope, SessionService, ChromeAPIService) {

        function loadSessions() {
            return SessionService.getAllSessions()
                .then(function(state) {
                    $scope.$apply(function() {
                        $scope.sessionList = state.sessionList;
                        $scope.activeSession = state.activeSession;
                    });
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

        // Action functions
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
                });
        };
        $scope.removeSession = function(name) {
            return SessionService.removeSession(name)
                .then(function(sessions) {
                    $scope.closeModal('delete-modal');
                    return loadSessions();
                });
        };
        $scope.afterSave = function() {
            loadSessions();
        };

        // Load session on controller load
        loadSessions();

        // var legacyStorage = JSON.parse(localStorage.getItem('SESSIONS'));
        // var sessions = [];
        // for (key in legacyStorage) if (legacyStorage.hasOwnProperty(key))
            // sessions.push(new switchr.Session(key, legacyStorage[key].map(function(tabList) {
                // return new switchr.Window(tabList.map(function(url) {
                    // return new switchr.Tab(url);
                // }));
            // })));
        // localStorage.setItem('SESSIONS_V3', JSON.stringify(sessions));
    }]);
