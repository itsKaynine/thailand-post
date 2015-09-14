"use strict";

var TrackService = require('./');

new TrackService().init(function(err, serv) {
	serv.getItem("EN331755897TH", function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getServices(function(err, result) {
		console.log(result);
	});

	serv.getRates("TH", 0.05, function(err, result) {
		console.log(result);
	});
});