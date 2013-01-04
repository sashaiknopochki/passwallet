var express = require('express'),
	passwallet = require('passwallet'),
	request = require('supertest'),
	assert = require('assert');

var app = express()
		.use(express.bodyParser())
		.use(passwallet.middleware());

var webServiceURL = '',
	version = 1;

var Pass = require('./fixtures/pass'),
	Registration = require('./fixtures/registration'),
	Device = require('./fixtures/device');

var registerRequest = {
	url: webServiceURL+'/'+version+'/devices/'+Pass.passes[0].deviceLibraryIdentifier+'/registrations_attido/'+Pass.passes[0].passTypeIdentifier+'/'+Pass.passes[0].serialNumber,
	timeout: 500,
	method: 'POST',
	headers: {
		Authorization: 'AttidoPass ' + Pass.passes[0].authenticationToken
	},
	data: {
		pushToken: 'randomDeviceString',
		pushServiceUrl: 'https://some.rand/domain'
	}
};

describe('API', function() {
	describe('load', function () {
		beforeEach(function() {
			passwallet.Pass = undefined;
			passwallet.Registration = undefined;
		});
		it('bad pass model', function(done) {
			assert.throws(function () {
				passwallet.loadPass(function() {});
			});
			assert.equal(passwallet.Pass, undefined);
			done();
		});
		it('good pass model', function(done) {
			passwallet.loadPass(Pass);
			assert.equal(passwallet.Pass, Pass);
			done();
		});
		it('bad registration model', function(done) {
			assert.throws(function () {
				passwallet.loadRegistration(function() {});
			});
			assert.equal(passwallet.Registration, undefined);
			done();
		});
		it('good registration model', function(done) {
			passwallet.loadRegistration(Registration);
			assert.equal(passwallet.Registration, Registration);
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
				.expect(201, done); // Created
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
				.set('Authorization', 'AttidoPass abcde')
				.send(registerRequest.data)
				.expect(401, done); // Unauthorised
		});
		it('malformed request', function(done) {
			request(app)
				.post(registerRequest.url)
				.set(registerRequest.headers)
				.send({})
				.expect(400, done); // Bad Request
		});
	});
	describe('push update notification', function() {
		it('single', function(done) {
			assert.doesNotThrow(function () {
				passwallet.pushUpdate(Pass.passes, function (err, passes) {
					if (err) throw err;
				});
			});
			done();
		});
		it('multiple', function(done) {
			assert.doesNotThrow(function () {
				passwallet.pushUpdate(Pass.passes, function (err, passes) {
					if (err) throw err;
				});
			});
			done();
		});
	});
});