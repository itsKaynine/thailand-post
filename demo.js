"use strict";

var TrackService = require('./').TrackService;


var trackService = new TrackService({
	lang: "EN"
});

trackService.init(function(err, serv) {
	serv.getItem("EN331755897TH", function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result.ItemsData.Items[0]);
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

	serv.getRates("TH", 30, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getRatesByService("1", "TH", 120, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});

	serv.getAllLocations(function(err, result) {
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

	serv.getNearbyLocations(13.11143, 101.154250, 10, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result);
	});
});