var switchr = (function(switchr) {

    /** @constructor */
    function Window(tabList, options, id) {
        this.tabList = tabList;
        this.options = options;
        this.id = id;
    }

    Window.prototype.getTabsCount = function() {
        return this.tabList.length;
    };

    Window.prototype.hasTab = function(tab) {
        return this.tabList.filter(function(_tab) {
            return tab.equals(_tab);
        }).length > 0;
    };

    Window.prototype.equals = function(otherWindow) {
        var self = this;
        return typeof otherWindow === typeof self
            && otherWindow.getTabsCount() === self.getTabsCount()
            && self.tabList.every(function(tab) { return otherWindow.hasTab(tab); })
            && otherWindow.tabList.every(function(tab) { return self.hasTab(tab); });
    };

    Window.prototype.clone = function() {
        var _tabList = this.tabList.map(function(tab) { return tab.clone(); });
        var _options = {};
        for (key in this.options) if (this.options.hasOwnProperty(key)) {
            _options[key] = this.options[key];
        }
        return new Window(_tabList, _options);
    };

    Window.revive = function(objectData) {
        if (!objectData.tabList) throw new TypeError();
        var _tabList = objectData.tabList.map(function(data) {
            return new switchr.Tab(data.url, data.options);
        });
        return new Window(_tabList, objectData.options);
    };


    switchr.Window = Window;
    return switchr;
})(window.switchr || {});
