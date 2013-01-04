#About [![Build Status](https://travis-ci.org/mayeskennedy/passwallet.png)](https://travis-ci.org/mayeskennedy/passwallet)
=====

passwallet is a [Connect](http://senchalabs.github.com/connect/) and [Express](http://expressjs.com/) middleware for [Attido Mobile's](http://attidomobile.com) [PassWallet](http://passwallet.attidomobile.com) API.

Think [Apple's iOS Passbook](http://www.apple.com/ios/whats-new/#passbook) for the rest of us (currently supports Android and BlackBerry, others to follow).

## Installation

	$ npm install passwallet

## Usage

	var express = require('express'),
		passwallet = require('passwallet');

	var app = express()
			.use(passwallet.middleware());

	// when models have loaded
	passwallet.loadPass(Pass/*Some model*/);
	passwallet.loadPass(Registration/*Some model*/);
	passwallet.loadPass(Device/*Some model*/);

## Required functions
	Pass.pwFind = function ({
		passTypeIdentifier: ?,
		serialNumber: ?
	}, function (err, pass));

	Registration.pwFind = function ({
		deviceLibraryIdentifier: ?,
		passTypeIdentifier: ?,
		serialNumber: ?
	}, function (err, registration));

	Registration.pwCreate = function ({
		deviceLibraryIdentifier: ?,
		passTypeIdentifier: ?,
		serialNumber: ?
	}, function (err, registration));

	Device.pwFind = function ({
		deviceLibraryIdentifier: ?
	}, function (err, device));

	Device.pwCreate = function ({
		deviceLibraryIdentifier: ?,
		pushToken: ?,
		pushServiceUrl: ?
	}, function (err, device));

## Run tests

	$ npm test

## Credits

  - [Simon Mayes](https://github.com/msyea)
  - Project sponsored and funded by [Mayes, Kennedy & Company](http://mayeskennedy.co.uk)