var express = require('express'),
	passwallet = require('passwallet'),
	request = require('supertest'),
	assert = require('assert');

var app = express()
		.use(passwallet.middleware());

var webServiceURL = '',
	version = 1,
	deviceLibraryIdentifier = 'x',
	passTypeIdentifier = 'y',
	serialNumber = 'z';

var Pass = function (attributes) {
	if ('object' === typeof attributes) {
		for (var attribute in attributes) {
			this[attribute] = attributes[attribute];
		}
	}
};
Pass.prototype.pushServiceUrl = null;

var passes = [
	new Pass({passTypeIdentifier: 'pass.com.mayeskennedy.attido-pass', serialNumber: 'ABC123', authenticationToken: 'abcdefgh12345678'}),
	new Pass({passTypeIdentifier: 'pass.com.mayeskennedy.attido-pass', serialNumber: 'ABC124', authenticationToken: 'abcdefgh12345679'}),
];

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
	describe('load', function () {
		beforeEach(function() {
			passwallet.Pass = undefined;
		});
		it('good pass model', function(done) {
			passwallet.loadPass(Pass);
			assert.equal(passwallet.Pass, Pass);
			done();
		});
		it('bad pass model', function(done) {
			assert.throws(function () {
				passwallet.loadPass(function() {});
			});
			assert.equal(passwallet.Pass, undefined);
			done();
		});
	});
	describe('registering device', function() {
		before(function() {
			// this needs to be delayed because in MVC models aren't typically loaded until way after the middleware
			passwallet.loadPass(Pass);
		});
		it('register device', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(202, done); // Created
		});
		it('register device again', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(200, done); // OK
		});
		it('bad authorisation', function(done) {
			request(app)
				.post(registerRequest.url)
				// .set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(401, done); // Unauthorised
		});
		it('malformed request', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send(registerRequest.data)
				.expect(400, done); // Bad Request
		});
	});
	describe('push update notification', function() {
		it('single', function(done) {
			passwallet.pushUpdate({}, function (err, passes) {
				if (err) throw err;
				assert.equal(null, passes);
				done();
			});
		});
	});
});