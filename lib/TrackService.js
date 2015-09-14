"use strict";

var constants = require('constants');
var soap = require('soap');

var CustomSSLSecurity = require('./CustomSSLSecurity');
var keygen = require('./keygen')


//-- Globals --//

var ENDPOINT = "https://track.thailandpost.co.th/TTSPSW/track.asmx";
var WSDL_PATH = "http://track.thailandpost.co.th/TTSPSW/track.asmx?WSDL";
//var WSDL_PATH = "track.wsdl";


//-- Helpers --//

function updateSecurity(client) {
	var sslOptions = {
		userAgent: "TTPTracker/1.8.2 CFNetwork/711.3.18 Darwin/14.0.0",
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
		updateSecurity(client);

		var args = {
			user: self.constants.user,
			password: self.constants.password,
			deviceType: self.constants.deviceType,
			lastmessage: "",
			lang: self.constants.lang
		};

		client.MessageBoardJson(args, function(err, result) {
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

	this.client.GetItems(args, function(err, result) {
		if (err) {
			return callback(err);
		}

		callback(null, result.GetItemsResult);
  	});
};

TrackService.prototype.getItem = function getItem(barcode, callback) {
	var args = {
		user: this.constants.user,
		password: this.constants.password,
		lang: this.constants.lang,
		Barcodes: barcode
	};

	this.client.GetItems(args, function(err, result) {
		if (err) {
			return callback(err);
		}

		callback(null, result.GetItemsResult);
  	});
};
