var Device = module.exports = function (attributes) {
	if ('object' === typeof attributes) {
		for (var attribute in attributes) {
			this[attribute] = attributes[attribute];
		}
	}
};

Device.devices = [];

/**
 * @api private
 */
Device._all = function (query, callback) {
	for (var i in Device.devices) {
		var device = Device.devices[i];
		if (device.passTypeIdentifier === query.where.passTypeIdentifier
			&& device.serialNumber === query.where.serialNumber) {
			return callback(null, [device]);
		}
	}
	return callback(null, []);
};

/**
 * @api public
 */
Device.pwFind = function (query, callback) {
	Device._all({
		where: query
	}, function (err, devices) {
		callback(err, devices[0]?devices[0]:null);
	});
};

/**
 * @api public
 */
Device.pwCreate = function (attributes, callback) {
	var device = new Device(attributes);
	Device.devices.push(device);
	callback(null, [device]);
};
