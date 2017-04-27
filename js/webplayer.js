var on = require('add-event-listener')
var drop = require('drag-and-drop-files')
var filereader = require('filereader-stream')
var vtt = require('srt-to-vtt')
var concat = require('concat-stream')
var $ = document.querySelector.bind(document)

var $body = $('body')
var $menu = $('#menu')
var $hidden = $('#hidden-file')
var $file = $('#file')
var $url = $('#url')
var $video = $('video')

var play = function(url) {
  $menu.style.display = 'none'
  $body.style.backgroundColor = '#000'

  var $src = document.createElement('source')
  $src.setAttribute('src', url)
  $src.setAttribute('type', 'video/mp4')

  $video.style.display = 'block'
  $video.appendChild($src)
  $video.play()
}

var onsubs = function(buf) {
  if ($('track')) $video.removeChild($('track'))

  var $track = document.createElement('track')
  $track.setAttribute('default', 'default')
  //$track.setAttribute('src', 'data:text/vtt;base64,'+buf.toString('base64'))
  $track.setAttribute('src', buf)
  $track.setAttribute('label', 'Subtitles')
  $track.setAttribute('kind', 'subtitles')
  $video.appendChild($track)
}

on($hidden, 'change', function() {
  onfile($hidden.files[0])
})

on($url, 'click', function(e) {
    play('http://localhost:8888/')
    onsubs('../sub.vtt')
})

on($body, 'load', function() {
    play('http://localhost:8888/')
})

if (location.hash.split('#').pop()) play(location.hash.split('#').pop())
