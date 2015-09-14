"use strict";

var TrackService = require('./');

new TrackService().init(function(err, service) {
	service.getItem("EN331755897TH", function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});
});