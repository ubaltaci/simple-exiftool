"use strict";

const Fs = require("fs");
const Path = require("path");
const Expect = require("chai").expect;
const Exif = require("..");

describe("giving invalid paths to exiftool", () => {

    it("should return error when source is undefined", (done) => {

        Exif(undefined, (error) => {

            Expect(error).to.exist;
            done();
        });
    });

    it("should return error when source is empty", (done) => {

        Exif("", (error) => {

            Expect(error).to.exist;
            done();
        });
    });

    it("should return error when source is invalid path", (done) => {

        Exif("/a/b/c/d/e/f/g.jpg", (error) => {

            Expect(error).to.exist;
            done();
        });
    });

    it("should return error when source array contains invalid paths", (done) => {

        Exif([Path.join(__dirname, "files/lion.jpg"), "/a/b/c/d/e/f/g.jpg"], (error) => {

            Expect(error).to.exist;
            done();
        });
    });
});

describe("giving valid paths to exiftool", () => {

    describe("giving path of 1 jpeg image to exiftool", () => {

        it("should return mediadata of given jpeg image", (done) => {

            Exif(Path.join(__dirname, "files/lion.jpg"), (error, metadata) => {

                Expect(error).to.not.exist;
                Expect(metadata).to.have.property("FileType");
                Expect(metadata).to.have.property("MIMEType");
                Expect(metadata["MIMEType"]).to.equal("image/jpeg");
                done();
            });
        });
    });

    describe("giving array of 2 jpeg file paths to exiftool", () => {

        it("should return mediadata of given 2 jpeg image", (done) => {

            Exif([Path.join(__dirname, "files/lion.jpg"), Path.join(__dirname, "files/dolphin.jpg")], (error, metadata) => {

                Expect(error).to.not.exist;
                Expect(metadata).to.have.lengthOf(2);
                Expect(metadata[0]).to.have.property("FileType");
                Expect(metadata[0]).to.have.property("MIMEType");
                Expect(metadata[0]["MIMEType"]).to.equal("image/jpeg");
                Expect(metadata[1]).to.have.property("FileType");
                Expect(metadata[1]).to.have.property("MIMEType");
                Expect(metadata[1]["MIMEType"]).to.equal("image/jpeg");
                done();
            });
        });
    });

    describe("giving array of 1 mp4 file path and 1 jpeg file to exiftool", () => {

        it("metadata should return array of given media's metadata", (done) => {

            Exif([Path.join(__dirname, "files/lion.jpg"), Path.join(__dirname, "files/big_buck_bunny.mp4")], (error, metadata) => {

                Expect(error).to.not.exist;
                Expect(metadata).to.have.lengthOf(2);
                Expect(metadata[0]).to.have.property("FileType");
                Expect(metadata[0]).to.have.property("MIMEType");
                Expect(metadata[0]["MIMEType"]).to.equal("image/jpeg");
                Expect(metadata[1]).to.have.property("FileType");
                Expect(metadata[1]).to.have.property("MIMEType");
                Expect(metadata[1]["MIMEType"]).to.equal("video/mp4");
                done();
            });
        });
    });
});

describe("giving binary data to exiftool", () => {

    let binaryData;

    before((done) => {

        Fs.readFile(Path.join(__dirname, "files/lion.jpg"), (error, data) => {

            if (error) {
                throw error;
            }

            binaryData = data;
            done();
        });
    });

    it("should return mediadata of given jpeg image", (done) => {

        Exif(binaryData, (error, metadata) => {

            Expect(error).to.not.exist;
            Expect(metadata).to.have.property("FileType");
            Expect(metadata).to.have.property("MIMEType");
            Expect(metadata["MIMEType"]).to.equal("image/jpeg");
            done();
        });
    });
});
