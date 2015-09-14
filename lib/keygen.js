"use strict";

var dateFormat = require('dateformat');
var crypto = require("crypto");

var AES_KEY = "2847291740385938";

function createCipher(key, iv) {
	return crypto.createCipheriv('aes-128-cbc', key, iv);
}

function encrypt(key, data) {
	var cipher = createCipher(key, String.fromCharCode(0).repeat(key.length))
	var crypted = cipher.update(data, 'utf-8', 'base64');
	crypted += cipher.final('base64');

	return crypted;
}

function generateXmlKey() {
	var dateString = dateFormat(new Date(), "yyyymmddHH");
	return encrypt(AES_KEY, dateString);
}

module.exports = {
	generateXmlKey: generateXmlKey
};