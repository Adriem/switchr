var switchr = (function(switchr) {

    /** @constructor */
    function Session(name, windowList) {
        this.name = name;
        this.windowList = windowList || [];
    }

    Session.prototype.getWindowCount = function() {
        return this.windowList.length;
    };

    Session.prototype.getTabCount = function() {
        return this.windowList.reduce(function(accum, window) {
            return accum + window.getTabsCount();
        }, 0);
    };

    Session.prototype.hasTab = function(tab) {
        return this.windowList.reduce(function(accum, window) {
            return accum || window.hasTab(tab);
        }, false);
    };

    // TODO: needs testing
    Session.prototype.checkForChanges = function(otherSession) {
        var self = this;
        return self.getWindowCount() !== otherSession.getWindowCount()
            || this.windowList.reduce(function(accum, window) {
                return accum
                    || countWindowAppearances(window, self)
                        !== countWindowAppearances(window, otherSession);
            }, false);
            // This iteration is not necesary since we are ensuring the
            // window count is the same for the two sessinos
            // || otherSession.windowList.reduce(function(accum, window) {
                // return accum ||
                    // countWindowAppearances(window, self)
                        // !== countWindowAppearances(window, otherSession);
            // }, false)
    };

    function countWindowAppearances(window, session) {
        return session.windowList.reduce(function(accum, _window) {
            return window.equals(_window) ? accum + 1 : accum;
        }, 0);
    }

    Session.prototype.clone = function() {
        var _windowList = this.windowList.map(function(window) {
            return window.clone();
        });
        return new Session(this.name, _windowList);
    };

    Session.revive = function(objectData) {
        if (!objectData.name) throw new TypeError('Data does not contain \'name\' field');
        if (!objectData.windowList) throw new TypeError('Data does not contain \'windowList\' field');
        var _windowList = objectData.windowList.map(function(data) {
            return switchr.Window.revive(data);
        });
        return new Session(objectData.name, _windowList);
    };


    switchr.Session = Session;
    return switchr;
})(window.switchr || {});
