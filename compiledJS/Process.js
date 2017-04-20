"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exec = require('child_process').exec;
var Process = (function () {
    function Process(name) {
        /* If false, process does not exist or it was killed
        if it's true, process is running */
        this.status = false;
        this.name = name;
    }
    // Setters
    Process.prototype.setPID = function (pid) {
        this.pid = pid;
    };
    // Getters
    Process.prototype.getPID = function () {
        return this.pid;
    };
    Process.prototype.getStatus = function () {
        return this.status;
    };
    // Methods
    Process.prototype.retrievePIDByName = function () {
        var _this = this;
        if (this.name == 'undefined') {
            return 0;
        }
        var cmd = 'pgrep -f ' + this.name;
        exec(cmd, function (err, stdout, stderror) {
            if (err) {
                console.error(err);
                return;
            }
            _this.pid = stdout;
            _this.status = true;
            return _this.pid;
        });
        return 0;
    };
    Process.prototype.killProcess = function () {
        var _this = this;
        var cmd = 'kill ' + this.pid;
        exec(cmd, function (err, stderr, stdout) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log(stdout);
            console.log(stderr);
            _this.status = false;
            return true;
        });
        return true;
    };
    return Process;
}());
exports.Process = Process;
//# sourceMappingURL=Process.js.map