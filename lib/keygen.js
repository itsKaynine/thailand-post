"use strict";

var crypto = require("crypto");
var moment = require('moment-timezone');

var AES_KEY = '2847291740385938';

function createCipher(key, iv) {
	return crypto.createCipheriv('aes-128-cbc', key, iv);
}

function encrypt(key, data) {
	var iv = [];
	for (var i = 0; i < key.length; i++) {
		iv.push(String.fromCharCode(0))
	}

	var cipher = createCipher(key, iv.join(''));
	var crypted = cipher.update(data, 'utf-8', 'base64');
	crypted += cipher.final('base64');

	return crypted;
}

function generateXmlKey() {
	var dateString = moment().tz('Asia/Bangkok').format('YYYYMMDDHH');
	return encrypt(AES_KEY, dateString);
}

module.exports = {
	generateXmlKey: generateXmlKey
};