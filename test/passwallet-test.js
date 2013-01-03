var express = require('express'),
	passwallet = require('passwallet'),
	request = require('supertest');

var app = express()
		.use(passwallet());

var webServiceURL = '',
	version = 1,
	deviceLibraryIdentifier = '',
	passTypeIdentifier = '',
	serialNumber = '';

var registerRequest = {
	url: webServiceURL+'/'+version+'/devices/'+deviceLibraryIdentifier+'/registrations_attido/'+passTypeIdentifier+'/'+serialNumber,
	timeout: 500,
	method: 'POST',
	headers: {
		Authorization: 'AttidoPass '
	},
	data: {
		pushToken: '',
		pushServiceUrl: ''
	}
};

describe('API', function() {
	describe('registering device', function () {
		it('register device', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(202) // Created
				.end(done);
		});
		it('register device again', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(200) // OK
				.end(done);
		});
		it('bad authorisation', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(401) // Unauthorised
				.end(done);
		});
		it('malformed request', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(400) // Bad Request
				.end(done);
		});
	});
});