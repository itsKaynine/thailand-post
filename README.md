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

var trackService = new TrackService({
	lang: "EN"	// either EN or TH
});

trackService.init(function(err, serv) {
	// ... your code here

	// serv.getItem(...)
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

serv.getItems(barcodes, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```

### Get shipping rates

```js
var country = "TH"; // Thailand
var weight = 30; // 30g

serv.getRates(country, weight, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```

### Get all branches

```js
serv.getAllLocations(function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```

### Search for a branch

```js
var keyword = "คลอง";

serv.searchLocation(keyword, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```

### Get nearby locations

```js
var latitude = 13.11143;
var longitude = 101.154250;
var numOfResults = 10;

serv.getNearbyLocations(latitude, longitude, numOfResults, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```

### Get countries

You can then use the country code to find shipping rates.

```js
serv.getCountries(function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```


## Advanced Usage

This is for anyone who would like to access the SOAP API directly.

Visit the official Thailand Post [SOAP API documentation](https://track.thailandpost.co.th/TTSPSW/track.asmx) for more information on each operation.

### Track items

```js
var args = {
	user: serv.defaultArgs.user,
	password: serv.defaultArgs.password,
	lang: serv.defaultArgs.lang,
	Barcodes: "EN331755897TH,RI598984676CN"
};

serv.client.GetItems(args, function(err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(result);
});
```