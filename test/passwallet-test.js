var connect = require('connect'),
	passwallet = require('passwallet');

var app = connect(passwallet());

var webServiceURL = '',
	version = 1,
	deviceLibraryIdentifier = '',
	passTypeIdentifier = '',
	serialNumber = '';

module.exports = {
	"test register device": function (assert) {
		assert.response(app,
			{url: webServiceURL+'/'+version+'/devices/'+deviceLibraryIdentifier+'/registrations_attido/'+passTypeIdentifier+'/'+serialNumber},
			{status: 200}
		);
	}
};