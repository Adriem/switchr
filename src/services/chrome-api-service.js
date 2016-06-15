angular.module('switchr').service('ChromeAPIService', [
    function() {

        function chromeToDomain(window) {
            var options = {
                alwaysOnTop: window.alwaysOnTop,
                height: window.height,
                width: window.width,
                top: window.top,
                left: window.left
            };
            var tabList = window.tabs.map(function(tab) {
                return new switchr.Tab(tab.url, {
                    title: tab.title,
                    faviconUrl: tab.faviconUrl,
                    pinned: tab.pinned,
                    index: tab.index
                });
            });
            return new switchr.Window(tabList, options, window.id);
        }

        this.getWindows = function(callback) {
            return new Promise(function(resolve, reject) {
                chrome.windows.getAll({
                    populate: true,
                    windowTypes: ['normal']
                }, function(windows) {
                    resolve(windows);
                });
            }).then(function(windows) {
                return windows.map(chromeToDomain);
            });
        };

        this.createWindows = function(windows) {
            var accum = [];
            for (var i = 0; i < windows.length; i++) {
                accum.push(new Promise(function(resolve, reject) {
                    var _createData = windows[i].options || {};
                    _createData.url = windows[i].tabList.map(function(tab) {
                        return tab.url;
                    });
                    chrome.windows.create(_createData, function(win) {
                        resolve(chromeToDomain(win));
                    });
                }));
            }
            return Promise.all(accum);
        };

        this.closeWindows = function(windows) {
            var accum = [];
            for (var i = 0; i < windows.length; i++) {
                accum.push(new Promise(function(resolve, reject) {
                    if (windows[i].id) {
                        chrome.windows.remove(windows[i].id, function() {
                            console.log('Solved ' + windows[i].id);
                            resolve(windows[i]);
                        });
                    } else {
                        reject(new Error('Cannot close window without id'));
                    }
                }));
            }
            return Promise.all(accum);
        };

    }]);
