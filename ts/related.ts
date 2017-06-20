// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { Movie } from './Movie'
import { Controller } from './Controller'
import { RelatedController } from './RelatedController'

const $ = require('jQuery')
const imdb = require('imdb-api')
const yify = require('yify-search')

let query, maxlength = 35
let ctrl = new Controller()
let relCtrl = new RelatedController()

$(window).on('load', function() {
    relCtrl.findRelatedMovies()
})

$(document).on('click', 'a.suggMovie', function() {
    var movieID = $(this).attr('id')
    ctrl.searchTorrent(movieID, '')
})

/*$(document).on('click', 'a.watch', function() {
   var movieID = $(this).attr('id')
   var movieQualArray = $(this).attr('class').split(' ')
   var movieQual = movieQualArray[movieQualArray.length - 1]
   console.log(movieQualArray + ' - ' + movieQual)
   ctrl.streamTorrent(movieID, movieQual)
})

$(document).on('click', 'a.genres', function() {
    var genre = $(this).attr('id')
    ctrl.searchTorrent('', genre)
    $('h3#genre-title').text(genre)
    console.log('Searching ' + genre + ' movies.')
})

$(document).on('click', 'a.trailer', function() {
    var movieID = $(this).attr('id')
    ctrl.openTrailer(movieID)
})

$(document).on('click', 'a.sub', function() {
    var movieID = $(this).attr('id')
    $('.sub').css('border', 'none')
    $(this).css('border', '2px solid orange')
    var movieLang = $(this).find('span').attr('id')
    console.log(movieID + ' - ' + movieLang)
    ctrl.setSubLang(movieID, movieLang)
})*/
