var Device = function (attributes) {
	if ('object' === typeof attributes) {
		for (var attribute in attributes) {
			this[attribute] = attributes[attribute];
		}
	}
};
Device.prototype.deviceLibraryIdentifier = null;
Device.devices = [];
Device.create = function (attributes, callback) {
	var device = new Device(attributes);
	Device.devices.push(device);
	callback(null, [device]);
};
Device.all = function (query, callback) {
	for (var i in Device.devices) {
		var device = Device.devices[i];
		if (device.passTypeIdentifier === query.where.passTypeIdentifier
			&& device.serialNumber === query.where.serialNumber) {
			return callback(null, [device]);
		}
	}
	return callback(null, []);
};

module.exports = Device;