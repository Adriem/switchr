angular.module('switchr').service('ChromeAPIService', [
    function() {

        this.getWindows = function(callback) {
            var promise = new Promise(function(resolve, reject) {
                chrome.windows.getAll({
                    populate: true,
                    windowTypes: ['normal']
                }, function(windows) {
                    resolve(windows);
                });
            });
            if (callback !== undefined) return promise.then(callback);
            else return promise;
        };

        this.createWindow = function(urlList, options) {
            var _createData = {}
            _createData.url = urlList;
            _createData.width = options ? options.width : undefined;
            _createData.height = options ? options.height : undefined;
            return new Promise(function(resolve, reject) {
                chrome.windows.create(_createData, function(w) {
                    console.log('Solved ' + w.id);
                    resolve(w);
                });
            });
        };

        this.closeWindows = function(windows) {
            var accum = [];
            for (var i = 0; i < windows.length; i++) {
                accum.push(new Promise(function(resolve, reject) {
                    chrome.windows.remove(windows[i].id, function() {
                        console.log('Solved ' + windows[i].id);
                        resolve(windows[i]);
                    });
                }));
            }
            return Promise.all(accum);
        };

        this.closeAllWindows = function() {
            return this.getWindows().then(function(windows) {
                return this.closeWindows(windows);
            });
        };
    }]);
