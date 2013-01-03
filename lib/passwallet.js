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

exports.middleware = function (options) {
	if ('object' == typeof options) {
		options = options || {};
	} else if ('string' == typeof options) {
		options = { something: options };
	} else {
		options = {};
	}

	var app = express();

	app.post('/:version/devices/:deviceLibraryIdentifier/registrations_attido/:passTypeIdentifier/:serialNumber', function (req, res) {
		var params = req.params;
		res.send(400);
	});

	return app;
};

exports.loadPass = function (pass) {
	if ('undefined' === typeof pass.pushServiceURL) {
		throw new Error('pass must have attribute "pushServiceURL" to use passwallet module')
	}
	exports.Pass = pass;
};

exports.pushUpdate = function (passes, callback) {
	var request = {
		'passTypeId': '',
		'pushTokens': []
	};

	callback(new Error('updates not pushed'), null);
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