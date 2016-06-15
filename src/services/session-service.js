angular.module('switchr').service('SessionService', [
    'LocalStorageKeys', 'SessionRepositoryService',
    function(LocalStorageKeys, SessionRepositoryService) {

        function getActiveSession(name) {
            return localStorage.getItem(LocalStorageKeys.ACTIVE_SESSION);
        }
        function setActiveSession(name) {
            if (name) {
                localStorage.setItem(LocalStorageKeys.ACTIVE_SESSION, name);
            } else {
                localStorage.removeItem(LocalStorageKeys.ACTIVE_SESSION);
            }
        }

        this.getSession = function(name) {
            return SessionRepositoryService.findSession(name);
        };

        this.getAllSessions = function() {
            var state = {};
            return SessionRepositoryService.findAllSessions()
                .then(function(sessions) {
                    var activeSession = getActiveSession();
                    state.sessionList = sessions;
                    if (activeSession) {
                        return SessionRepositoryService
                                .findSessionByName(activeSession);
                    } else {
                        return null;
                    }
                })
                .then(function(activeSession) {
                    state.activeSession = activeSession;
                    return state;
                });
        };

        this.loadSession = function(name, keepPrevious) {
            var activeSession, openedWindows;
            return SessionRepositoryService.findSession(name)
                .then(function(session) {
                    activeSession = session;
                    setActiveSession(session);
                    return ChromeAPIService.getWindows();
                })
                .then(function(windows) {
                    openedWindows = windows;
                    return ChromeAPIService.createWindows(session.windowList);
                })
                .then(function() {
                    if (!keepPrevious) {
                        return ChromeAPIService.closeWindows(openedWindows);
                    }
                });
        };

        this.closeSession = function() {
            var windowList;
            SessionService.setCurrentSession(null);
            return ChromeAPIService.getWindows()
                .then(function(windows) {
                    windowList = windows;
                    return ChromeAPIService.createWindow([new switchr.Window()]);
                })
                .then(function(windowList) {
                    return ChromeAPIService.closeWindows(windowList);
                });
        };

        this.removeSession = function(name) {
            if (session.name === getActiveSession()) setActiveSession(null);
            return SessionRepositoryService.removeSession(name);
        };

        this.renameSession = function(oldName, newName) {
            if (oldName === getActiveSession()) setActiveSession(newName);
            return SessionRepositoryService.findSessionByName(oldName)
                .then(function(session) {
                    session.name = newName;
                    return SessionRepositoryService.updateSession(oldName, session);
                });
        };

        this.createSession = function(session) {
            setActiveSession(session.name);
            return SessionRepositoryService.insertSession(session);
        };

        this.saveSession = function(session) {
            return SessionRepositoryService.updateSession(session.name, session);
        };

    }]);
