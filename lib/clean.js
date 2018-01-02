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

var _ = require('lodash'),
    probelist = require('./probelist'),
    keys =  _.keys(probelist.types);

module.exports = function clean(obj) {
	var nobj = _.pickBy(obj, function(value, key) {
		if (!keys.includes(key)) return false;

		switch (typeof value) {
		case 'boolean':
			if (probelist.types[key] === Boolean) return true;
			break;
		case 'number':
			if (probelist.types[key] === Number) return true;
			break;
		case 'string':
			if (probelist.types[key] === String) return true;
			break;
		default:
			return false;
		}
	});

	if (_.isEmpty(nobj)) return nobj;

	if (!nobj.PING) nobj.PING = true;

	return nobj;
};
