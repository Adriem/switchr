angular.module('switchr').service('SessionRepositoryService', [
    'LocalStorageKeys',
    function(LocalStorageKeys) {

        function loadSessions() {
            var _json = localStorage.getItem(LocalStorageKeys.SESSIONS);
            var _sessions = JSON.parse(_json || '[]');
            return _sessions.map(function(x) {
                return switchr.Session.revive(x);
            });
        }
        function getSessionByName(name, sessions) {
            var _sessions = sessions || loadSessions();
            return _sessions.filter(function(session) {
                return session.name === name;
            })[0];
        }
        function saveSessions(sessions) {
            var _json = JSON.stringify(sessions);
            localStorage.setItem(LocalStorageKeys.SESSIONS, _json);
        }

        /* Finds and returns a session with the given name */
        this.findSessionByName = function(name) {
            var _session = getSessionByName(name);
            return _session
                    ? Promise.resolve(_session)
                    : Promise.reject(new Error('Session not found'));
        }

        /* Finds and returns all the stored sessions */
        this.findAllSessions = function() {
            return Promise.resolve(loadSessions());
        }

        /* Inserts a new session if the name is not in use */
        this.insertSession = function(session) {
            var _sessions = loadSessions();
            if (getSessionByName(session.name, _sessions)) {
                return Promise.reject(new Error('Name already in use'));
            }
            _sessions.push(session);
            saveSessions(_sessions);
            return Promise.resolve(session);
        }

        /* Updates an existing session */
        this.updateSession = function(name, sessionData) {
            var _sessions = loadSessions();
            var _session = getSessionByName(name, _sessions);
            if (!_session) {
                return Promise.reject(new Error('Session does not exist'));
            }
            if (sessionData.name
                    && sessionData.name !== name
                    && getSessionByName(sessionData.name, _sessions)) {
                return Promise.reject(new Error('Name already in use'));
            }
            _sessions = _sessions.filter(function(session) {
                return session.name !== name;
            });
            _sessions.push(sessionData);
            saveSessions(_sessions);
            return Promise.resolve(_session);
        }

        /* Removes an existing session from the repository */
        this.removeSession = function(name) {
            var _sessions = loadSessions();
            var _session = getSessionByName(name, _sessions);
            if (!_session) {
                return Promise.reject(new Error('Session does not exist'));
            }
            saveSessions(_sessions.filter(function(session) {
                return session.name !== name;
            }));
            return Promise.resolve(_session);
        }

    }]);
