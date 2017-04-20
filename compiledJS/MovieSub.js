"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emit_1 = require("./emit");
var yifySub = require('yifysubtitles');
var MovieSub = (function () {
    function MovieSub(mv) {
        this.imdbCode = mv.getIMDB();
        this.searchSub(mv);
    }
    /* Interface Methods */
    MovieSub.prototype.searchSub = function (mv) {
        var _this = this;
        yifySub(this.imdbCode, { path: '/tmp', lang: ['en', 'it'], format: 'srt' })
            .then(function (res) {
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