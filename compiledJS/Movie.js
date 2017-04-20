"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sub = (function () {
    function Sub(title, path, lang, movieIMDB) {
        this.title = title;
        this.path = path;
        this.lang = lang;
        this.movieIMDB = movieIMDB;
    }
    // Methods
    Sub.prototype.isEmpty = function () {
        if (this.path == '')
            return true;
        return false;
    };
    // Getters
    Sub.prototype.getTitle = function () {
        return this.title;
    };
    Sub.prototype.getLang = function () {
        return this.lang;
    };
    Sub.prototype.getLink = function () {
        return this.path;
    };
    Sub.prototype.getIMDB = function () {
        return this.movieIMDB;
    };
    return Sub;
}());
var Movie = (function () {
    function Movie(title, bgImage, coverImage, desc, magnet, imdbCode, year, torrent) {
        this.title = title;
        this.bgImage = bgImage;
        this.coverImage = coverImage;
        this.desc = desc;
        this.magnet = magnet;
        this.imdbCode = imdbCode;
        this.year = year;
        this.torrent = torrent;
        this.subs = [];
    }
    // Getters
    Movie.prototype.getTitle = function () {
        return this.title;
    };
    Movie.prototype.getBgImage = function () {
        return this.bgImage;
    };
    Movie.prototype.getCoverImage = function () {
        return this.coverImage;
    };
    Movie.prototype.getDesc = function () {
        return this.desc;
    };
    Movie.prototype.getMagnet = function () {
        return this.magnet;
    };
    Movie.prototype.getIMDB = function () {
        return this.imdbCode;
    };
    Movie.prototype.getYear = function () {
        return this.year;
    };
    Movie.prototype.getTorrent = function () {
        return this.torrent;
    };
    Movie.prototype.getSubs = function () {
        return this.subs;
    };
    // Setters
    Movie.prototype.setSubs = function (data) {
        console.log('[EVENT] setting subs for: ' + this.title);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var sub = data_1[_i];
            var s = new Sub(this.title, sub.path.replace(/\s/g, ''), sub.langShort, this.imdbCode);
            this.subs.push(s);
        }
    };
    return Movie;
}());
exports.Movie = Movie;
//# sourceMappingURL=Movie.js.map