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

## Run tests

	$ npm test