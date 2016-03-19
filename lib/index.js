"use strict";

const ChildProcess = require("child_process");
const _ = require("lodash");

/**
 *
 * @param {(string|string[])} source
 * @param {object|function} [settings] - exiftool settings
 * @param {function} callback
 */
module.exports = (source, settings, callback) => {

    if (typeof settings === "function") {
        callback = settings;
        settings = {
            binary: "exiftool",
            args: ["-json", "-n"]
        };
    }

    if (!source) {
        return callback(new Error("source should be either string, array of string or binary data."));
    }

    let isBinary = false;

    if (!settings.args || settings.args.indexOf("-json") == -1) {
        settings.args = settings.args || [];
        settings.args.push("-json");
    }

    // source can be three things: file path, array of file paths or binary data.
    if (_.isString(source)) { // file path
        settings.args.push(source);
    }
    else if (_.isArray(source)) { // array of file paths

        for (let filePath of source) {
            settings.args.push(filePath);
        }
    }
    else {
        // The dash specifies to read data from stdin.
        isBinary = true;
        settings.args.push("-");
    }

    const exif = ChildProcess.spawn(settings.binary, settings.args);

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