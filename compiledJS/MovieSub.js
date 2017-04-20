"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emit_1 = require("./emit");
var yifySub = require('yifysubtitles');
var fs = require('fs');
var MovieSub = (function () {
    function MovieSub(mv) {
        this.imdbCode = mv.getIMDB();
        this.searchSub(mv);
    }
    /* Interface Methods */
    MovieSub.prototype.searchSub = function (mv) {
        var _this = this;
        yifySub(this.imdbCode, { path: '/tmp', langs: ['en', 'it'], format: 'srt' })
            .then(function (res) {
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var s = res_1[_i];
                fs.rename(s.path, s.path.replace(/\s/g, ''), function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            _this.subs = res;
            emit_1.emitter.emitSubs(res, mv);
        });
    };
    // Getters
    MovieSub.prototype.getSubs = function () {
        return this.subs;
    };
    return MovieSub;
}());
exports.MovieSub = MovieSub;
//# sourceMappingURL=MovieSub.js.map