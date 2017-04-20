"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dns = require('dns');
var fs = require('fs');
var exec = require('child_process').exec;
var zlib = require('zlib');
var Utils = (function () {
    function Utils() {
    }
    /* Methods */
    /* Check for internet connection */
    Utils.prototype.checkConnection = function () {
        dns.lookup('google.com', function (err) {
            if (err && err.code == 'ENOTFOUND') {
                console.log('[Error] connection failed');
                return false;
            }
            else {
                console.log('[Success] connection established');
                return true;
            }
        });
        console.log('[Error] connection failed');
        return false;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map