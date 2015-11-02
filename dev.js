var chokidar = require('chokidar');
// require('babel-polyfill');

var path = require('path');

var _invalidateRequireCacheForFile = function(mod) {

	if (!mod) {
		return;
	}

	if (mod.children) {
		mod.children.forEach(_invalidateRequireCacheForFile);
	}

	delete require.cache[mod.filename];
};

var requireNoCache = function(filePath) {
	var resolved = path.resolve(filePath);
	_invalidateRequireCacheForFile(require.cache[resolved]);
	return require(filePath);
};

var rerun = function() {
	requireNoCache('./build/node-index.js');
};

rerun();

var watcher = chokidar.watch('./build', {ignored: 'build/test/*.*'}).on('change', rerun)

setTimeout(function() {
	watcher.on('add', rerun);
}, 4000);
