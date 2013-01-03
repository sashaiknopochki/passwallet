/*!
 * Connect - PassWallet
 * Copyright © 2013 Mayes, Kennedy & Company 
 *
 */


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

exports = module.exports = function passwallet(options) {
	if ('object' == typeof options) {
		options = options || {};
	} else if ('string' == typeof options) {
		options = { something: options };
	} else {
		options = {};
	}


	return function passwallet(req, res, next) {
		next();
	};
};