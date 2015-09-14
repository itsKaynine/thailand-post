"use strict";

var TrackService = require('./');

var ts = new TrackService(function(err, client) {
	var getItemsArg = {
		user: ts.constants.user,
		password: ts.constants.password,
		lang: ts.constants.lang,
		Barcodes: "EN331755897TH"
	};

  	client.GetItemsJson(getItemsArg, function(err, result) {
		if (err) {
			return console.log(err);
		}

		var jsonResult = JSON.parse(result.GetItemsJsonResult);
  		console.log(jsonResult);
  	});

  	client.GetItems(getItemsArg, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log(result.GetItemsResult.ItemsData.Items);
  	});
});