# Thailand Post SDK

An **unofficial** Node SDK for **Thailand Post** that consumes the official API.

> **WARNING**
> 
> This project contains information that was obtained from reverse-engineering.   
> In order to legally use the official API, you must [send a request](http://www.thailandpost.co.th/download/Web%20Service.pdf) to Thailand Post.

## Installation

```
$ [sudo] npm install thailand-post
```

## Usage

First, you need to import the module and create an instance of the service.

```js
var TrackService = require('thailand-post').TrackService;

new TrackService().init(function(err, serv) {
	// ... your code here
});
```

### Track an Item

Single item

```js
var barcode = "EN331755897TH";

serv.getItem(barcode, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```

Multiple items

```js
var barcodes = ["EN331755897TH", "RI598984676CN"];

serv.getItem(barcodes, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```
