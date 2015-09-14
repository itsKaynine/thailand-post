"use strict";

var TrackService = require('./');

new TrackService().init(function(err, serv) {
	serv.getItem("EN331755897TH", function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getCountries(function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getServices(function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getAllRates("TH", 0.05, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getRates("TH", "1", 0.05, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getRates("TH", "1", 0.05, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.searchLocation("คลอง", function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});
});