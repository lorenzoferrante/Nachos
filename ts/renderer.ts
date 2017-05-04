// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { Movie } from './Movie'
import { Controller } from './Controller'
import { Utils } from './Utils'

const $ = require('jQuery')
const imdb = require('imdb-api')
const yify = require('yify-search')

let query, maxlength = 35
let ctrl = new Controller()
let utils = new Utils()

 $(window).on('load', function() {
   $('#no-res').hide()
   $('#waiting').hide()

   ctrl.searchTorrent('')
 })

 $('#search-btn').on('click', function() {
   $('p').text(function (_, text) {
      return $.trim(text).substring(0, maxlength);
   })

   $('#results').empty()
   query = $('#str').val()
   ctrl.searchTorrent(query)
})

$(document).on('click', 'a.watch', function() {
   var movieID = $(this).attr('id')
   var movieQualArray = $(this).attr('class').split(' ')
   var movieQual = movieQualArray[movieQualArray.length - 1]
   console.log(movieQualArray + ' - ' + movieQual)
   ctrl.streamTorrent(movieID, movieQual)
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
})

$(document).on('click', 'a#close-box', function() {
   $('#waiting').hide()
   $('#container').removeClass('blur')
   ctrl.closePeerflix()
})
