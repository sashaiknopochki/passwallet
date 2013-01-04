/*!
 * Connect - PassWallet
 * Copyright © 2013 Mayes, Kennedy & Company 
 *
 */

var express = require('express'),
	async = require('async'),
	Pass, Registration, Device;

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
	if ('function' !== typeof pass.pwFind) {
		throw new Error('pass must have function "pass.pwFind" to use passwallet module');
	}
	exports.Pass = Pass = pass;
};

exports.loadRegistration = function (registration) {
	if ('function' !== typeof registration.pwFind) {
		throw new Error('registration must have function "registration.pwFind" to use passwallet module');
	}
	if ('function' !== typeof registration.pwCreate) {
		throw new Error('registration must have function "registration.pwCreate" to use passwallet module');
	}
	exports.Registration = Registration = registration;
};

exports.loadDevice = function (device) {
	if ('function' !== typeof device.pwFind) {
		throw new Error('device must have function "device.pwFind" to use passwallet module');
	}
	if ('function' !== typeof device.pwCreate) {
		throw new Error('device must have function "device.pwCreate" to use passwallet module');
	}
	exports.Device = Device = device;
};

exports.pushUpdate = function (passes, callback) {
	if (!passes instanceof Array) {
		passes = [passes];
	}
	for (var i in passes) {
		var pass = passes[i];
		Registration.all({
			where: {
				passTypeIdentifier: pass.passTypeIdentifier,
				serialNumber: pass.serialNumber
			}, limit: 1
		}, function (err, passes) {
			if (err) throw err;
			if (passes.length) {

			}
		});
	}
	callback(new Error('updates not pushed'), null);
};

var registerDevice = function (req, res) {
	var deviceLibraryIdentifier = req.params.deviceLibraryIdentifier,
		passTypeIdentifier = req.params.passTypeIdentifier,
		serialNumber = req.params.serialNumber,
		pushToken = req.body.pushToken,
		pushServiceUrl = req.body.pushServiceUrl;

	var inputs = [
		deviceLibraryIdentifier,
		passTypeIdentifier,
		serialNumber,
		pushToken,
		pushServiceUrl
	];

	for(var i in inputs) {
		if (!inputs[i]) {
			return res.send(400); // Bad Request
		}
	}

	// 'x-forwarded-proto' is a Heroku proxy header
	// if ((req.get('x-forwarded-proto') && 'https' !== req.get('x-forwarded-proto')) || !req.secure || 'test' === process.env.NODE_ENV) {
	// 	return res.send(426);  // Upgrade Required (ie. switch to https://)
	// }

	var auth = req.get('Authorization') || '';

	if ('AttidoPass' !== auth.slice(0, 10)) {
		return res.send(400); // Bad Request
	}

	var authenticationToken = auth.slice(11);

	if (!authenticationToken) {
		return res.send(401); // Unauthorised
	}

	// Consider refactoring!
	async.series([
		function (callback) { // Check authorisation
			Pass.pwFind({
				passTypeIdentifier: passTypeIdentifier,
				serialNumber: serialNumber
			}, function (err, pass) {
				if (err) {
					err.status = 500; // Internal Server Error: We cocked up
					callback(err);
				} else if (pass && authenticationToken === pass.authenticationToken) {
					callback(null, pass);
				} else {
					var error = new Error('Unauthorized');
					error.status = 401;
					callback(error);
				}
			});
		},
		function (callback) { // Process registration
			Registration.pwFind({
				deviceLibraryIdentifier: deviceLibraryIdentifier,
				passTypeIdentifier: passTypeIdentifier,
				serialNumber: serialNumber
			}, function (err, registration) {
				if (err) {
					err.status = 500; // Internal Server Error: We cocked up
					callback(err);
				} else if (registration) {
					var error = new Error('Ok: Already registered');
					error.status = 200;
					callback(error);
				} else {
					Registration.pwCreate({
						deviceLibraryIdentifier: deviceLibraryIdentifier,
						passTypeIdentifier: passTypeIdentifier,
						serialNumber: serialNumber
					}, function(err, registration) {
						if (err) {
							err.status = 500; // Internal Server Error: We cocked up
							callback(err);
						} else {
							Device.pwFind({
								deviceLibraryIdentifier: deviceLibraryIdentifier
							}, function (err, device) {
								if (err) {
									err.status = 500; // Internal Server Error: We cocked up
									callback(err);
								} else if (device) {
									var error = new Error('Created: Registration succeeded');
									error.status = 201;
									callback(error);
								} else {
									Device.pwCreate({
										deviceLibraryIdentifier: deviceLibraryIdentifier,
										pushToken: pushToken,
										pushServiceUrl: pushServiceUrl
									}, function(err, device) {
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