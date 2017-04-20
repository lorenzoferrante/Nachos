"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Torrent = (function () {
    function Torrent(status, hash, quality, size, url) {
        this.status = status;
        this.hash = hash;
        this.quality = quality;
        this.size = size;
        this.url = url;
    }
    // Getters
    Torrent.prototype.getTorrentURL = function () {
        return this.url;
    };
    Torrent.prototype.getQuality = function () {
        return this.quality;
    };
    Torrent.prototype.getStatus = function () {
        return this.status;
    };
    Torrent.prototype.getSize = function () {
        return this.size;
    };
    return Torrent;
}());
exports.Torrent = Torrent;
//# sourceMappingURL=Torrent.js.map