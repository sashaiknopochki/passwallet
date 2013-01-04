var Pass = module.exports = function (attributes) {
	if ('object' === typeof attributes) {
		for (var attribute in attributes) {
			this[attribute] = attributes[attribute];
		}
	}
};
Pass.prototype.passTypeIdentifier = Pass.prototype.serialNumber = Pass.prototype.authenticationToken = Pass.prototype.pushServiceUrl = null;
Pass.passes = [
	new Pass({passTypeIdentifier: 'pass.com.mayeskennedy.attido-pass', serialNumber: 'ABC123', authenticationToken: 'abcdefgh12345678'}),
	new Pass({passTypeIdentifier: 'pass.com.mayeskennedy.attido-pass', serialNumber: 'ABC124', authenticationToken: 'abcdefgh12345679'}),
];
Pass.all = function (query, callback) {
	for (var i in Pass.passes) {
		var pass = Pass.passes[i];
		if (pass.passTypeIdentifier === query.where.passTypeIdentifier
			&& pass.serialNumber === query.where.serialNumber) {
			return callback(null, [pass]);
		}
	}
	return callback(null, []);
};

Pass.pwFind = function (query, callback) {
	Pass.all({
		where: query
	}, function (err, passes) {
		callback(err, passes[0]?passes[0]:null);
	});
};