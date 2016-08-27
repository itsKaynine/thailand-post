"use strict";

var constants = require('constants');
var soap = require('soap');

var CustomSSLSecurity = require('./CustomSSLSecurity');
var keygen = require('./keygen');


//-- Globals --//

var ENDPOINT = "https://track.thailandpost.co.th/TTSPSW/track.asmx";
var WSDL_PATH = "https://track.thailandpost.co.th/TTSPSW/track.asmx?WSDL" || "track.wsdl";
var USER_AGENT = "TTPTracker/1.8.5.4 CFNetwork/758.3.15 Darwin/15.4.0";


//-- Helpers --//
function updateToken(client) {
	var keyHeader = '<PublicKeySoapHeader xmlns="http://tempuri.org/">' +
				'<PublicXmlKey>' + keygen.generateXmlKey() + '</PublicXmlKey>' +
				'</PublicKeySoapHeader>';

	var soapHeaders = client.getSoapHeaders();
	if (!soapHeaders || soapHeaders.length <= 0) {
		client.addSoapHeader();
	}

	client.getSoapHeaders()[0] = keyHeader;
}

function updateSecurity(client) {
	var sslOptions = {
		userAgent: USER_AGENT,
		secureOptions: constants.SSL_OP_NO_TLSv1_2,
		rejectUnauthorized: false,
		strictSSL: false
	};

	client.setSecurity(new CustomSSLSecurity(client.lastResponseHeaders, '', '', sslOptions));
}


//-- Class -- //

function TrackService(options) {
	var opts = options || {};

	var user = opts.user || "usr_smartphone_ios";
	var password = opts.password || "odTxaswzbGARDMgjYEnsd8YiWE6AE0j5";
	var lang = opts.lang || "en";
	var deviceType = opts.deviceType || "IOS";

	this.client = null;
	this.defaultArgs = {
		user: user,
		password: password,
		lang: lang.toLowerCase(),
		deviceType: deviceType
	};
}
module.exports = TrackService;

TrackService.prototype.init = function init(callback) {
	var self = this;

	// Ignore self signed certificate error
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

	soap.createClient(WSDL_PATH, {endpoint: ENDPOINT}, function(err, client) {
		if (err) {
			return callback(err);
		}

		updateSecurity(client);
		updateToken(client);

		var args = {
			user: self.defaultArgs.user,
			password: self.defaultArgs.password,
			deviceType: self.defaultArgs.deviceType,
			lastmessage: "",
			lang: self.defaultArgs.lang
		};

		client.MessageBoardJson(args, function(err, res) {
			if (err) {
				return callback(err);
			}

			updateSecurity(client);

		  	self.client = client;
		  	return callback(null, self);
		});
	});
};

TrackService.prototype.getItems = function getItems(barcodes, callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		lang: this.defaultArgs.lang,
		Barcodes: barcodes.join(',')
	};

	this.client.GetItems(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		callback(null, res.GetItemsResult);
  	});
};

TrackService.prototype.getItem = function getItem(barcode, callback) {
	return this.getItems([barcode], callback);
};

TrackService.prototype.getServices = function getServices(callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		deviceType: this.defaultArgs.deviceType
	};

	this.client.SmartPhoneGetServicesJson(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		try {
			var result = JSON.parse(res.SmartPhoneGetServicesJsonResult);
			callback(null, result);
		}
		catch (e) {
			return callback(e);
		}
  	});
};

TrackService.prototype.getCountries = function getCountries(callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		deviceType: this.defaultArgs.deviceType
	};

	this.client.SmartPhoneGetCountryJson(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		try {
			var result = JSON.parse(res.SmartPhoneGetCountryJsonResult);
			callback(null, result);
		}
		catch (e) {
			return callback(e);
		}
  	});
};

TrackService.prototype.getRates = function getRates(country, weight, callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		deviceType: this.defaultArgs.deviceType,
		country: country, // countryCode (string)
		weight: weight / 1000 // in kilograms (float)
	};

	this.client.SmartPhoneGetRateAllJson(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		try {
			var result = JSON.parse(res.SmartPhoneGetRateAllJsonResult);
			callback(null, result);
		}
		catch (e) {
			return callback(e);
		}
  	});
};

TrackService.prototype.getRatesByService = function getRatesByService(serviceType, country, weight, callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		deviceType: this.defaultArgs.deviceType,
		country: country,
		servicetype: serviceType, // serviceInt (int)
		weight: weight / 1000 // in kilograms (float)
	};

	this.client.SmartPhoneGetRateWeightJson(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		try {
			var result = JSON.parse(res.SmartPhoneGetRateWeightJsonResult);
			callback(null, result);
		}
		catch (e) {
			return callback(e);
		}
  	});
};

TrackService.prototype.searchLocation = function searchLocation(keyword, callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		deviceType: this.defaultArgs.deviceType,
		keyword: keyword
	};

	this.client.SmartPhoneGetPostLocationJson(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		try {
			var result = JSON.parse(res.SmartPhoneGetPostLocationJsonResult);
			callback(null, result);
		}
		catch (e) {
			return callback(e);
		}
  	});
};

TrackService.prototype.getAllLocations = function getAllLocations(callback) {
	return this.searchLocation('', callback);
};

TrackService.prototype.getNearbyLocations = function getNearbyLocations(latitude, longitude, locations, callback) {
	var args = {
		user: this.defaultArgs.user,
		password: this.defaultArgs.password,
		deviceType: this.defaultArgs.deviceType,
		loc: latitude + "," + longitude,
		point: locations
	};

	this.client.GetLocationClosest(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		var result = [];
		var resString = res.GetLocationClosestResult;

		if (!resString || resString !== "") {
			var spl = resString.split("|+");
			spl.pop();

			spl.forEach(function(item) {
				var fields = item.split("|");

				result.push({
					GPS: fields[0],
					ZIPCODE: fields[1],
					POSTNAME: fields[2]
				});
			});
		}

		callback(null, result);
  	});
};
