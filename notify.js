var notifier = require('node-notifier');

listenToStream(process.stdin, 'test');

function listenToStream(stream, title) {
	stream.resume();
	stream.setEncoding('utf8');
	stream.on('data', function(data) {

		if (data === '\u0003') {
			process.exit();
		}

		console.log(data);
		data = data.trim();

		if (data.search(/passing|failing/) === -1) {
			return;
		}

		data = data.match(/\d\s+(passing|failing).*/)[0];

		notifier.notify({
			title: title,
			message: data,
			wait: true
		});
	});

}
