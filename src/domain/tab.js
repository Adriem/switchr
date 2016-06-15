var switchr = (function(switchr) {

    /** @constructor */
    function Tab(url, options) {
        this.url = url;
        this.options = options;
    }

    Tab.prototype.equals = function(otherTab) {
        return typeof otherTab === typeof this
            && otherTab.url === this.url;
    };

    Tab.prototype.clone = function() {
        var _options = {};
        for (key in this.options) if (this.options.hasOwnProperty(key)) {
            _options[key] = this.options[key];
        }
        return new Tab(this.url, _options);
    };

    switchr.Tab = Tab;
    return switchr;
})(window.switchr || {});
