require('babel-core/register');
var chokidar = require('chokidar');
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
	requireNoCache('./src/index.js');
};

rerun();

var watcher = chokidar.watch('./src', {ignored: 'src/test/*.*'}).on('change', rerun)

setTimeout(function() {
	watcher.on('add', rerun);
}, 4000);
