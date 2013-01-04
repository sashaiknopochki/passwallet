var Registration = module.exports = function (attributes) {
	if ('object' === typeof attributes) {
		for (var attribute in attributes) {
			this[attribute] = attributes[attribute];
		}
	}
};
Registration.prototype.deviceLibraryIdentifier = null;
Registration.registrations = [];

Registration.all = function (query, callback) {
	for (var i in Registration.registrations) {
		var registration = Registration.registrations[i];
		if (registration.deviceLibraryIdentifier === query.where.deviceLibraryIdentifier
			&& registration.passTypeIdentifier === query.where.passTypeIdentifier
			&& registration.serialNumber === query.where.serialNumber) {
			return callback(null, [registration]);
		}
	}
	return callback(null, []);
};

Registration.pwFind = function (query, callback) {
	Registration.all({
		where: query
	}, function (err, registrations) {
		callback(err, registrations[0]?registrations[0]:null);
	});
};

Registration.pwCreate = function (attributes, callback) {
	var registration = new Registration(attributes);
	Registration.registrations.push(registration);
	callback(null, [registration]);
};