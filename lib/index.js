"use strict";

const ChildProcess = require("child_process");
const _ = require("lodash");

/**
 *
 * @param {(string|string[])} source
 * @param {string|function} [binaryPath] - exiftool binary path
 * @param {function} callback
 */
module.exports = (source, binaryPath, callback) => {

    if (typeof binaryPath === "function") {
        callback = binaryPath;
        binaryPath = "exiftool";
    }

    if (!source) {
        return callback(new Error("source should be either string, array of string or binary data."));
    }

    let isBinary = false;
    const args = ["-json"];

    // source can be three things: file path, array of file paths or binary data.
    if (_.isString(source)) { // file path
        args.push(source);
    }
    else if (_.isArray(source)) { // array of file paths

        for (let filePath of source) {
            args.push(filePath);
        }
    }
    else {
        // The dash specifies to read data from stdin.
        isBinary = true;
        args.push("-");
    }

    // we need stdout as json, if `-json` argument does not exist,
    // push into exifArguments
    if (args.indexOf("-json") == -1) {
        args.push("-json");
    }

    const exif = ChildProcess.spawn(binaryPath, args);

    exif.on("error", (error) => {

        return callback(new Error("exiftool error:" + error));
    });

    let stdOut = "";
    let stdError = "";

    exif.stdout.on("data", (data) => {
        stdOut += data;
    });

    exif.stderr.on("error", (data) => {
        stdError += data;
    });

    // Handle the response to the callback to hand the metadata back.
    exif.on("close", () => {

        if (stdError) {
            return callback(stdError);
        }

        try {

            const json = JSON.parse(stdOut);

            if (json && _.isArray(json) && json.length == 1) {
                return callback(null, json[0]);
            }
            return callback(null, json);
        }
        catch (e) {

            return callback(new Error("Unable to parse output from exiftool, probably it is not installed. " + e));
        }
    });

    if (isBinary) {
        // Give the source binary data to the process which will extract the meta data.
        exif.stdin.write(source);
        exif.stdin.end();
    }
};