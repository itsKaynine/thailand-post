"use strict";

var constants = require('constants');
var soap = require('soap');

var CustomSSLSecurity = require('./CustomSSLSecurity');
var keygen = require('./keygen')


//-- Globals --//

var ENDPOINT = "https://track.thailandpost.co.th/TTSPSW/track.asmx";
var WSDL_PATH = "http://track.thailandpost.co.th/TTSPSW/track.asmx?WSDL";
//var WSDL_PATH = "track.wsdl";
var USER_AGENT = "TTPTracker/1.8.2 CFNetwork/711.3.18 Darwin/14.0.0";


//-- Helpers --//

function updateSecurity(client) {
	var sslOptions = {
		userAgent: USER_AGENT,
		secureOptions: constants.SSL_OP_NO_TLSv1_2,
		rejectUnauthorized: false,
		strictSSL: false
	};

	client.setSecurity(new CustomSSLSecurity(client.lastResponseHeaders, '', '', sslOptions));

	var soapHeaders = client.getSoapHeaders();
	if (!soapHeaders || soapHeaders.length <= 0) {
		var keyHeader = '<PublicKeySoapHeader xmlns="http://tempuri.org/">' +
							'<PublicXmlKey>' + keygen.generateXmlKey() + '</PublicXmlKey>' + 
							'</PublicKeySoapHeader>';

		client.addSoapHeader();
		client.getSoapHeaders()[0] = keyHeader;
	}
}


//-- Class -- //

function TrackService(callback) {
	this.client = null;
	this.constants = {
		user: "ca_sp_ios",
		password: "520tXllm2MXZIGWjL/wchA==",
		lang: "en",
		deviceType: "IOS"
	};
}
module.exports = TrackService;

TrackService.prototype.init = function init(callback) {
	var self = this;

	soap.createClient(WSDL_PATH, {endpoint: ENDPOINT}, function(err, client) {
		if (err) {
			return callback(err);
		}

		updateSecurity(client);

		var args = {
			user: self.constants.user,
			password: self.constants.password,
			deviceType: self.constants.deviceType,
			lastmessage: "",
			lang: self.constants.lang
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
		user: this.constants.user,
		password: this.constants.password,
		lang: this.constants.lang,
		Barcodes: barcodes.join(",")
	};

	this.client.GetItems(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		callback(null, res.GetItemsResult);
  	});
};

TrackService.prototype.getItem = function getItem(barcode, callback) {
	var args = {
		user: this.constants.user,
		password: this.constants.password,
		lang: this.constants.lang,
		Barcodes: barcode
	};

	this.client.GetItems(args, function(err, res) {
		if (err) {
			return callback(err);
		}

		callback(null, res.GetItemsResult);
  	});
};

TrackService.prototype.getServices = function getServices(callback) {
	var args = {
		user: this.constants.user,
		password: this.constants.password,
		deviceType: this.constants.deviceType
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
		user: this.constants.user,
		password: this.constants.password,
		deviceType: this.constants.deviceType
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

TrackService.prototype.getAllRates = function getAllRates(country, weight, callback) {
	var args = {
		user: this.constants.user,
		password: this.constants.password,
		deviceType: this.constants.deviceType,
		country: country, // countryCode (string)
		weight: weight // in kilograms (float)
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

TrackService.prototype.getRates = function getRates(country, serviceType, weight, callback) {
	var args = {
		user: this.constants.user,
		password: this.constants.password,
		deviceType: this.constants.deviceType,
		country: country,
		servicetype: serviceType, // serviceInt (int)
		weight: weight // in kilograms (float)
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
		user: this.constants.user,
		password: this.constants.password,
		deviceType: this.constants.deviceType,
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
	return this.searchLocation("", callback);
};
