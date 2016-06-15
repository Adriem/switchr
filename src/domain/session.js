var switchr = (function(switchr) {

    /** @constructor */
    function Session(name, windowList) {
        this.name = name;
        this.windowList = windowList;
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

    Session.prototype.checkForChanges = function(otherSession) {
        return true;
    };

    Session.prototype.clone = function() {
        var _windowList = this.windowList.map(function(window) {
            return window.clone();
        });
        return new Session(_tabList, _options);
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
