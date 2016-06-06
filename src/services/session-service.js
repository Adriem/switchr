angular.module('switchr').service('SessionService', [
    'LocalStorageKeys',
    function(LocalStorageKeys) {

        var sessions = null;

        function cloneSessions() {
            var _clone = {};
            for (key in sessions) if (sessions.hasOwnProperty(key)) {
                _clone[key] = sessions[key].map(function(item) {
                    return item.slice(0);
                });
            }
            return _clone;
        }

        function loadSessions() {
            if (!sessions || sessions === {}) {
                var _json = localStorage.getItem(LocalStorageKeys.SESSIONS);
                sessions = JSON.parse(_json || "{}");
            }
        }

        function saveSessions() {
            var _json = JSON.stringify(sessions);
            localStorage.setItem(LocalStorageKeys.SESSIONS, _json);
        }

        this.getSession = function(name) {
            loadSessions();
            return Promise.resolve(cloneSessions()[name]);
        };

        this.getSessions = function() {
            loadSessions();
            return Promise.resolve(cloneSessions());
        };

        this.createSession = function(name, windowList) {
            loadSessions();
            var _name = windowList ? name : 'default';
            var _windowList = windowList || name;
            sessions[_name] = _windowList;
            saveSessions();
            return Promise.resolve(sessions[_name]);
        };

        this.removeSession = function(name) {
            loadSessions();
            _deletedSession = sessions[name];
            delete sessions[name];
            saveSessions();
            return Promise.resolve(_deletedSession);
        };

    }]);
