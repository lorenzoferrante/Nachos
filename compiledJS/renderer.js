"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller_1 = require("./Controller");
var Utils_1 = require("./Utils");
var $ = require('jQuery');
var imdb = require('imdb-api');
var yify = require('yify-search');
var query, maxlength = 35;
var ctrl = new Controller_1.Controller();
var utils = new Utils_1.Utils();
$(window).on('load', function () {
    $('#no-res').hide();
    $('#waiting').hide();
    ctrl.searchTorrent('');
});
$('#search-btn').on('click', function () {
    $('p').text(function (_, text) {
        return $.trim(text).substring(0, maxlength);
    });
    $('#results').empty();
    query = $('#str').val();
    ctrl.searchTorrent(query);
});
$(document).on('click', 'a.watch', function () {
    $('#waiting').show();
    $('#container').addClass('blur');
    var movieID = $(this).attr('id');
    ctrl.streamTorrent(movieID);
});
$(document).on('click', 'a.sub', function () {
    var movieID = $(this).attr('id');
    ctrl.printSubs(movieID);
});
$(document).on('click', 'a#close-box', function () {
    $('#waiting').hide();
    $('#container').removeClass('blur');
    ctrl.closePeerflix();
});
//# sourceMappingURL=renderer.js.map