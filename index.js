var soap = require('soap');
var Cookie = require('soap-cookie');
var CustomSSLSecurity = require('./CustomSSLSecurity');

// "https://track.thailandpost.co.th/TTSPSW/track.asmx?WSDL"
var url = "track.wsdl";

var options = {
	endpoint: "https://track.thailandpost.co.th/TTSPSW/track.asmx"
};

var sslOptions = {
	rejectUnauthorized: false,
	strictSSL: false,
	//secureOptions: constants.SSL_OP_NO_TLSv1_2
};

var defaultArgs = {
	user: "ca_sp_ios",
	password: "520tXllm2MXZIGWjL/wchA==",
	lang: "en",
	deviceType: "IOS",
	lastmessage: ""
};

var PublicXmlKey = "bEn3Kq2pzTiCg/0sObciDQ==";
var publicKeySoapHeader = '<PublicKeySoapHeader xmlns="http://tempuri.org/"><PublicXmlKey>' + PublicXmlKey + '</PublicXmlKey></PublicKeySoapHeader>';

soap.createClient(url, options, function(err, client) {
	client.setSecurity(new soap.ClientSSLSecurity('', '', sslOptions));
	client.addSoapHeader({});
	client.getSoapHeaders()[0] = publicKeySoapHeader;

	var args1 = {
		user: defaultArgs.user,
		password: defaultArgs.password,
		deviceType: defaultArgs.deviceType,
		lastmessage: defaultArgs.lastmessage,
		lang: defaultArgs.lang
	};

	var args2 = {
		user: defaultArgs.user,
		password: defaultArgs.password,
		lang: defaultArgs.lang,
		Barcodes: ""
	};

	client.MessageBoardJson(args1, function(err, result) {
		if (err) {
			return console.log(err);
		}

		client.setSecurity(new CustomSSLSecurity(client.lastResponseHeaders, '', '', sslOptions));
	  	console.log(result);

	  	client.GetItemsJson(args2, function(err, result) {
			if (err) {
				return console.log(err);
			}

			var jsonResult = JSON.parse(result.GetItemsJsonResult);
	  		console.log(jsonResult);
	  	});
	});
});