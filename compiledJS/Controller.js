"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Movie_1 = require("./Movie");
var Torrent_1 = require("./Torrent");
var Process_1 = require("./Process");
var emit_1 = require("./emit");
var MovieSub_1 = require("./MovieSub");
var Utils_1 = require("./Utils");
var Notification_1 = require("./Notification");
var EventEmitter = require('events').EventEmitter;
var yify = require('yify-search');
var exec = require('child_process').exec;
var $ = require('jQuery');
var Controller = (function () {
    function Controller() {
        this.utils = new Utils_1.Utils();
        this.noti = new Notification_1.Notification();
        this.player = new Process_1.Process('peerflix');
    }
    // Methods
    /* Search torrent given the title using YIFY API */
    Controller.prototype.searchTorrent = function (query) {
        var _this = this;
        this.movieList = [];
        yify.search(query, function (error, result) {
            if (error) {
                console.log(error);
                _this.noti.netError();
                return;
            }
            if (result.length == 0) {
                $('#no-res').show();
                return;
            }
            else {
                $('#no-res').hide();
            }
            // reuslt is a JSON object
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var mv = result_1[_i];
                var tor = mv.torrents[0];
                _this.newTorrent = new Torrent_1.Torrent(mv.state, tor.hash, tor.quality, tor.size, tor.url);
                _this.movie = new Movie_1.Movie(mv.title, mv.background_image_original, mv.medium_cover_image, mv.summary, mv.magnet, mv.imdb_code, mv.year, _this.newTorrent);
                // Get subtitles
                var mvSub = new MovieSub_1.MovieSub(_this.movie);
                emit_1.emitter.receiveSubs(_this.movie);
                console.log(_this.movie.getTitle() + ': ' + _this.movie.getSubs);
                _this.movieList.push(_this.movie);
                $('#results').append('<li class="res"><div class="card" style="width: 100%;"><img class="card-img-top" src="' + _this.movie.getBgImage() + '"><div class="card-block"><img src="' + _this.movie.getCoverImage() + '" class="poster"><h4 class="card-title">' + _this.movie.getTitle() + '<br><span class="badge badge-pill badge-success">Size: ' + _this.newTorrent.getSize() + '</span><span class="badge badge-pill badge-primary">' + _this.newTorrent.getQuality() + '</span><span class="badge badge-pill badge-info">Year: ' + _this.movie.getYear() + '</span></h4><p class="card-text">' + _this.movie.getDesc() + '</p><a href="#' + $(_this).attr("id") + '" class="btn btn-primary watch" id="' + _this.movie.getIMDB() + '">Watch!</a></p><a href="#' + $(_this).attr("id") + '" class="btn btn-primary sub" id="' + _this.movie.getIMDB() + '">Subtitles</a></div></div></li>');
            }
        });
    };
    /* Methods to control Peerflix */
    Controller.prototype.peerflixManager = function (magnet, path, mv) {
        var _this = this;
        var cmd;
        this.noti.playing(mv);
        if (path != '') {
            cmd = 'peerflix "' + magnet + '" --vlc --subtitles ' + path;
        }
        else {
            cmd = 'peerflix "' + magnet + '" --vlc';
        }
        var peerflix = exec(cmd, { maxBuffer: 1024 * 100000 }, function (error, stdout, stderror) {
            if (error) {
                console.log('exec error: ' + error);
                return;
            }
            console.log('stdoud: ' + stdout);
            console.log('stderror: ' + stderror);
            var pid = _this.player.retrievePIDByName();
            console.log('Peerflix with PID: ' + pid);
        });
        peerflix.stdout.on('data', function (data) {
            //console.log(data.toString('utf8'))
        });
    };
    /* Stream a torrent using VLC and Peerflix from command line */
    Controller.prototype.streamTorrent = function (movieID) {
        for (var _i = 0, _a = this.movieList; _i < _a.length; _i++) {
            var mv = _a[_i];
            if (mv.imdbCode == movieID) {
                // Download Subtitle
                if (mv.getSubs().length > 0) {
                    var subPath = mv.getSubs()[0].getLink();
                    console.log(subPath);
                    console.log('Playing: ' + mv.title + ' with magnet: ' + mv.magnet);
                    this.peerflixManager(mv.magnet, subPath, mv);
                }
                else {
                    console.log('Playing: ' + mv.title + ' with magnet: ' + mv.magnet);
                    this.peerflixManager(mv.magnet, '', mv);
                }
            }
        }
    };
    /* Kill current Peerflix process and the associated VLC process */
    Controller.prototype.closePeerflix = function () {
        var pid = this.player.getPID();
        console.log('Killing Peerflix with PID: ' + pid);
        this.player.killProcess();
    };
    /* Print subs for a movie */
    Controller.prototype.printSubs = function (movieID) {
        for (var _i = 0, _a = this.movieList; _i < _a.length; _i++) {
            var mv = _a[_i];
            if (mv.imdbCode == movieID) {
                console.log('Showing subs for: ' + mv.title + ' - IMDB: ' + this.movie.getIMDB().substring(2));
                for (var _b = 0, _c = mv.getSubs(); _b < _c.length; _b++) {
                    var s = _c[_b];
                    console.log(s.getTitle() + ' - ' + s.getLang() + ' - ' + s.getIMDB() + ' - ' + s.getLink());
                }
            }
        }
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map