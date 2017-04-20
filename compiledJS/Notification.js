"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var notifier = require('node-notifier');
var path = require('path');
var Notification = (function () {
    function Notification() {
    }
    Notification.prototype.playing = function (mv) {
        notifier.notify({
            title: 'Playing: ' + mv.getTitle(),
            message: 'Wait until VLC will open',
            icon: path.join(__dirname, '../static/noti_logo.png'),
            sound: false,
            wait: false
        }, function (err, res) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(res);
        });
    };
    Notification.prototype.netError = function () {
        notifier.notify({
            title: 'Network Error',
            message: 'Check Internet connection and then try again',
            icon: path.join(__dirname, '../static/no_conn_logo.png'),
            sound: false,
            wait: false
        }, function (err, res) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(res);
        });
    };
    return Notification;
}());
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map