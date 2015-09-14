/*
-- Credits
This file has been adapted from an open source project.
You can find the source code of their open source projects along with license information below.

Project: SOAP Cookie Authentication https://github.com/shanestillwell/soap-cookie
Author: Shane A. Stillwell <shanestillwell@gmail.com>
License: BSD-2-Clause
*/

"use strict";

var fs = require('fs')
  , https = require('https')
  , _ = require('lodash');

/**
 * activates SSL for an already existing client
 *
 * @module CustomSSLSecurity
 * @param {Buffer|String}   key
 * @param {Buffer|String}   cert
 * @param {Buffer|String}   [ca]
 * @param {Object}          [defaults]
 * @constructor
 */
function CustomSSLSecurity(headers, key, cert, ca, defaults) {
  if (key) {
    if(Buffer.isBuffer(key)) {
      this.key = key;
    } else if (typeof key === 'string') {
      this.key = fs.readFileSync(key);
    } else {
      throw new Error('key should be a buffer or a string!');
    }

    if(this.key.toString().lastIndexOf('-----BEGIN RSA PRIVATE KEY-----', 0) !== 0) {
      throw new Error('key should start with -----BEGIN RSA PRIVATE KEY-----');
    }
  }

  if (cert) {
    if(Buffer.isBuffer(cert)) {
      this.cert = cert;
    } else if (typeof cert === 'string') {
      this.cert = fs.readFileSync(cert);
    } else {
      throw new Error('cert should be a buffer or a string!');
    }

    if(this.cert.toString().lastIndexOf('-----BEGIN CERTIFICATE-----', 0) !== 0) {
      throw new Error('cert should start with -----BEGIN CERTIFICATE-----');
    }
  }

  if (ca) {
    if(Buffer.isBuffer(ca)) {
      this.ca = ca;
    } else if (typeof ca === 'string') {
      this.ca = fs.readFileSync(ca);
    } else {
      defaults = ca;
      this.ca = null;
    }

    if(this.ca && this.ca.toString().lastIndexOf('-----BEGIN CERTIFICATE-----', 0) !== 0) {
      throw new Error('ca should start with -----BEGIN CERTIFICATE-----');
    }
  }

  this.defaults = {};
  _.merge(this.defaults, defaults);

  this.cookies = this.getCookies(headers);
}

/**
 * Required method for SOAP
 *
 * @param {Object} headers
 */
CustomSSLSecurity.prototype.addHeaders = function(headers) {
  headers['Cookie'] = this.cookies;
  headers['User-Agent'] = this.defaults.userAgent;
};

CustomSSLSecurity.prototype.addOptions = function(options) {
  options.key = this.key;
  options.cert = this.cert;
  options.ca = this.ca;
  _.merge(options, this.defaults);
  options.agent = new https.Agent(options);
};

/**
 * Required method for SOAP
 *
 * @returns {String}
 */
CustomSSLSecurity.prototype.toXML = function() {
  return '';
};

/**
 * Parse a headers object and extract the cookies into a string
 *
 * @param {Object} headers
 *
 * @returns {String}
 */
CustomSSLSecurity.prototype.getCookies = function(headers) {
  // Nothing to do
  if (!headers) {
    return null;
  }

  var cookies = [],
      resCookies = headers['set-cookie'] || [];

  for (var i = 0; i < resCookies.length; i++) {
    var cookie = resCookies[i].split(';');
    cookies.push(cookie[0]);
  }

  return cookies.join('; ');
};

module.exports = CustomSSLSecurity;