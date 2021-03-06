/*

Copyright 2017 AJ Jordan <alex@strugee.net>.

This file is part of the pump.io telemetry server.

the pump.io telemetry server is free software: you can redistribute it
and/or modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

the pump.io telemetry server is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with the pump.io telemetry server. If not, see
<https://www.gnu.org/licenses/>.

*/

'use strict';

var express = require('express'),
    compression = require('compression'),
    databank = require('databank'),
    path = require('path'),
    uuid = require('uuid'),
    Databank = databank.Databank,
    cleanData = require('./clean');

module.exports = function makeApp(config, log, callback) {
	var app = express(),
	    db;

	log.debug('Initializing server');

	app.set('views', path.resolve(__dirname, '../public/template'));
	app.set('view engine', 'pug');

	app.use(compression());
	app.use(express.json());

	app.use(function(req, res, next) {
		req.log = log.child({req_id: uuid.v4()});
		req.log.info({req: req});
		next();
	});

	app.get('/', function(req, res, next) {
		res.render('index');
	});

	app.get('/about', function(req, res, next) {
		res.render('about');
	});

	app.post('/submit', function(req, res, next) {
		// TODO do Dialback or something
		var data = cleanData(req.body);

		if (_.isEmpty(data)) {
			res.status(400);
			res.end('Submission was empty after cleaning');
			req.log({res: res}, 'Rejecting due to empty submission after cleaning.');
			return;
		}

		// TODO shove stuff in Databank

		res.status(202);
		res.end();
	});

	db = Databank.get(config.driver, config.params);

	log.debug('Connecting to databank with driver \''+config.driver+'\'');

	db.connect({}, function(err) {
		if (err) {
			callback(err);
			return;
		}

		
	});

	callback(undefined, app);
};
