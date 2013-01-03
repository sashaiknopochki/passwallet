#About [![Build Status](https://travis-ci.org/mayeskennedy/passbook.png)](https://travis-ci.org/mayeskennedy/passbook)
=====

passwallet is a [Connect](http://senchalabs.github.com/connect/) and [Express](http://expressjs.com/) middleware for [Attido Mobile's PassWallet](http://passwallet.attidomobile.com).

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