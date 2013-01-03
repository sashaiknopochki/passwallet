/*!
 * Connect - PassWallet
 * Copyright © 2013 Mayes, Kennedy & Company 
 *
 */

var express = require('express'),
	async = require('async');

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

	app.post('/:version/devices/:deviceLibraryIdentifier/registrations_attido/:passTypeIdentifier/:serialNumber', registerDevice);

	return app;
};

exports.loadPass = function (pass) {
	if ('undefined' === typeof pass.prototype.pushServiceUrl) {
		throw new Error('pass must have attribute "pushServiceURL" to use passwallet module');
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

var registerDevice = function (req, res) {
	var deviceLibraryIdentifier = req.params.deviceLibraryIdentifier,
		passTypeIdentifier = req.params.passTypeIdentifier,
		serialNumber = req.params.serialNumber;

	// 'x-forwarded-proto' is a Heroku proxy header
	// if ((req.get('x-forwarded-proto') && 'https' !== req.get('x-forwarded-proto')) || !req.secure || 'test' === process.env.NODE_ENV) {
	// 	return res.send(426);  // Upgrade Required (ie. switch to https://)
	// }

	var auth = req.get('Authorization') || '';

	if ('AttidoPass' === auth.slice(0, 10)) {
		return res.send(400); // Bad Request
	}

	var authenticationToken = auth.slice(11);

	if (!authenticationToken) {
		return res.send(401); // Unauthorised
	}

	async.series([
		function (callback) { // Check authorisation
			Pass.all({
				where: {
					passTypeIdentifier: passTypeIdentifier,
					serialNumber: serialNumber
				}, limit: 1
			}, function(err, passes) {
				if (err) {
					err.status = 500; // Internal Server Error: We cocked up
					callback(err);
				} else if (passes.length && authenticationToken === passes[0].authenticationToken) {
					callback(null, passes[0]);
				} else {
					var error = new Error('Unauthorized');
					error.status = 401;
					callback(error);
				}
			});
		},
		function (callback) { // Process registration
			Registration.all({
				where: {
					deviceLibraryIdentifier: deviceLibraryIdentifier,
					passTypeIdentifier: passTypeIdentifier,
					serialNumber: serialNumber
				}, limit: 1
			}, function(err, registrations) {
				if (err) {
					err.status = 500; // Internal Server Error: We cocked up
					callback(err);
				} else if (registrations.length) {
					var error = new Error('Ok: Already registered');
					error.status = 200;
					callback(error);
				} else {
					Registration.create({
						deviceLibraryIdentifier: deviceLibraryIdentifier,
						passTypeIdentifier: passTypeIdentifier,
						serialNumber: serialNumber
					}, function(err, registration) {
						if (err) {
							err.status = 500; // Internal Server Error: We cocked up
							callback(err);
						} else {
							callback(null, registration);
						}
					});
				}
			});
		}
	], function(err, results) {
		if (err) { // Note. Not always strictly an error but convenient construct
			return res.send(err.status);
		} else {
			return res.send(201) // Created: Registration succeeded
		}
	});
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