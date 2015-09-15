# Thailand Post SDK

An unofficial Node SDK for Thailand Post that consumes the official API.


## Installation

```
$ [sudo] npm install thailand-post
```

## Usage

First you need to create an instance of the SDK.

```js
var TrackService = require('thailand-post');

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