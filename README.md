![Build Status](https://travis-ci.org/ubaltaci/simple-exiftool.svg?branch=master)


[exiftool](http://owl.phy.queensu.ca/~phil/exiftool/) is a platform-independent Perl library plus a command-line application for reading, writing and editing meta information in a wide variety of files.

This npm package is a simple wrapper for exiftool, you can extract metadata / meta information from media files easily. Like; video duration, image resolution etc.

You can see complete list of supported media files from [here](http://www.sno.phy.queensu.ca/~phil/exiftool/#supported) including but not limited to `jpg, png, gif, mp4, mov, 3gp, pdf`.

* simple-exiftool requires Node v4+

## Quick Installation

* __OS X:__

```
brew update
brew install exiftool
npm install simple-exiftool --save
```

* __Ubuntu:__

```
sudo apt-get update
sudo apt-get install libimage-exiftool-perl
npm install simple-exiftool --save
```

* __Other:__ [Installing ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/install.html).

## Usage


```js
const Exif = require("simple-exiftool");
Exif(source, [settings], callback);

// Default settings are
// {
// 		binary: "exiftool",
//		args: ["-json", "-n"]
// }
// 
// -json argument can not be overriden, since this module parse outputs of exiftool with JSON.parse

```
###1. Passing single media file path
```js
const Exif = require("simple-exiftool");

Exif("/x/y/image.jpg", (error, metadata) => {
	
	if (error) {
        // handle error
	}
	console.log(metadata);
});
```

###2. Passing array of media files path
 
```js
const Exif = require("simple-exiftool");

Exif(["/x/yimage.jpg", "/a/bmovie.mp4"], (error, metadataArray) => {

	if (error) {
        // handle error
	}
	console.log(metadataArray[0], metadataArray[1]);
});

```

###3. Passing binary data
 
```js
const Exif = require("simple-exiftool");
const Fs = require("fs");

Fs.readFile("/x/y/image.jpg", (error, binaryData) => {

	if (error) {
        // handle error
	}

	Exif(binaryData, (error, metada) => {

		if (error) {
            // handle error
		}
		console.log(metada);
	});
});

```
###4. Exiftool binary path and extra arguments


```js
const Exif = require("simple-exiftool");

Exif("/x/y/image.jpg", {binary: "exiftool2", args:["-json", "-s"]}, (error, metadataArray) => {

	if (error) {
        // handle error
	}
	console.log(metadataArray[0], metadataArray[1]);
});

```


