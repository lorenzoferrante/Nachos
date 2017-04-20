"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require('events').EventEmitter;
EventEmitter.prototype._maxListeners = 100;
var SubEmitter = (function () {
    function SubEmitter() {
        this.emitter = new EventEmitter();
    }
    SubEmitter.prototype.emitSubs = function (subs, mv) {
        this.emitter.emit(mv.getTitle(), subs);
    };
    SubEmitter.prototype.receiveSubs = function (mv) {
        this.emitter.on(mv.getTitle(), function (data) {
            mv.setSubs(data);
        });
    };
    return SubEmitter;
}());
exports.SubEmitter = SubEmitter;
//# sourceMappingURL=SubEmitter.js.map