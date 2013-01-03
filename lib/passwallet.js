/*!
 * Connect - PassWallet
 * Copyright © 2013 Mayes, Kennedy & Company 
 *
 */

var express = require('express');

/**
 * PassWallet:
 *
 *
 *
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function (options) {
	if ('object' == typeof options) {
		options = options || {};
	} else if ('string' == typeof options) {
		options = { something: options };
	} else {
		options = {};
	}

	var app = express();

	app.get('/:version/devices/:deviceLibraryIdentifier/registrations_attido/:passTypeIdentifier/:serialNumber', function (req, res) {
		console.log(req.params);
		res.send(500);
	});

	return app;
};

if (!module.parent) {
    var port = process.env.PORT || 3000;
    var host = process.env.HOST || '0.0.0.0';
    var server = exports();
    server.listen(port, host);
    console.log(
        'Compound server listening on %s:%d within %s environment',
        host, port, server.settings.env);
}