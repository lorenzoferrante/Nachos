import { Movie } from './Movie'
import { Torrent } from './Torrent'
import { Process } from './Process'
import { emitter as EM } from './emit'
import { MovieSub } from './MovieSub'
import { Utils } from './Utils'
import { Notification } from './Notification'

const EventEmitter = require('events').EventEmitter
const pt = require('path')
const yify = require('../js/yify')
const exec = require('child_process').exec
const $ = require('jQuery')
const player = require('../js/player')
const humanizeDuration = require('humanize-duration')
const open = require('open')

class Controller {
      peerflix: Process
      utils: Utils
      noti: Notification
      movie: Movie
      movieList: Movie[]
      newTorrent: Torrent
      torrentList: Torrent[]
      pid: number

      constructor() {
          this.utils = new Utils()
          this.noti = new Notification()
          this.peerflix = new Process()
          this.movieList = []
          this.torrentList = []
      }

      // Methods
      /* Search torrent given the title using YIFY API */
      searchTorrent(query: string) {
          this.movieList = []
          this.torrentList = []

          yify.search(query, (error, result) => {
              if (error) {
                  console.log(error)
                  this.noti.netError()
                  return
              }

              if (result.length == 0) {
                  $('#no-res').show()
                  return
              } else {
                  $('#no-res').hide()
              }

              console.log(result)


              // Buttons to display for movie quality
              let qualityBtn: string = ''

              // reuslt is a JSON object
              for (let mv of result) {
                  let qualityBtn: string = ''

                  for (let tor of mv.torrents) {
                        this.torrentList.push(new Torrent(mv.state, tor.hash, tor.quality, tor.size, tor.url))

                        if (tor.quality == '720p') {
                            qualityBtn += '<a href="javascript:void(0)" class="btn btn-primary watch 720p" id="'+mv.imdb_code+'">720p</a>'
                        } else if (tor.quality == '1080p') {
                            qualityBtn += '<a href="javascript:void(0)" class="btn btn-primary watch 1080p" id="'+mv.imdb_code+'">1080p</a>'
                        } else if (tor.quality == '3D') {
                            qualityBtn += '<a href="javascript:void(0)" class="btn btn-primary watch 3D" id="'+mv.imdb_code+'">3D</a>'
                        }
                  }

                  let dur: string = String(humanizeDuration(mv.runtime * 60000))
                  let trailer: string = 'https://www.youtube.com/watch?v=' + mv.yt_trailer_code
                  this.movie = new Movie(mv.title, mv.background_image_original, mv.medium_cover_image, mv.summary, mv.magnet, mv.imdb_code, mv.year, dur, trailer, this.torrentList)

                  // Get subtitles
                  let mvSub = new MovieSub(this.movie)
                  EM.receiveSubs(this.movie)

                  this.movieList.push(this.movie)

                  //$('#results').append('<li class="res"><div class="card" style="width: 100%;"><img class="card-img-top" src="'+this.movie.getBgImage()+'"><div class="card-block"><img src="'+this.movie.getCoverImage()+'" class="poster"><h4 class="card-title">'+this.movie.getTitle()+'<br><span class="badge badge-pill badge-success">Size: '+this.newTorrent.getSize()+'</span><span class="badge badge-pill badge-primary">'+this.newTorrent.getQuality()+'</span><span class="badge badge-pill badge-info">Year: '+this.movie.getYear()+'</span></h4><p class="card-text">'+this.movie.getDesc()+'</p><a href="#'+$(this).attr("id")+'" class="btn btn-primary watch" id="'+this.movie.getIMDB()+'">Watch!</a></p><a href="#'+$(this).attr("id")+'" class="btn btn-primary sub" id="'+this.movie.getIMDB()+'">Subtitles</a></div></div></li>')

                  //$('#results').append('<li class="res"><div class="card" style="width: 100%;"><img class="card-img-top" src="'+this.movie.getBgImage()+'"><div class="card-block"><img src="'+this.movie.getCoverImage()+'" class="poster"><h4 class="card-title">'+this.movie.getTitle()+'<br><span class="badge badge-pill badge-success">'+this.newTorrent.getSize()+'</span><span class="badge badge-pill badge-primary">'+this.newTorrent.getQuality()+'</span><span class="badge badge-pill badge-info"> '+this.movie.getYear()+'</span><span class="badge badge-pill badge-warning">'+this.movie.getDuration()+'</span></h4><p class="card-text">'+this.movie.getDesc()+'</p><div><a href="#'+$(this).attr("id")+'" class="btn btn-primary watch" id="'+this.movie.getIMDB()+'">Watch!</a><a href="#'+$(this).attr("id")+'" class="btn btn-info trailer" id="'+this.movie.getIMDB()+'">Trailer</a><ul class="list-lang '+this.movie.getIMDB()+'"></ul></div></div></div></li>')

                  $('#results').append('<li class="res"><div class="card" style="width: 100%;"> <div class="img-cont"><img class="card-img-top" src="'+this.movie.getBgImage()+'"></div> <div class="card-block"><div class="poster-box"><img src="'+this.movie.getCoverImage()+'" class="poster"></div> <h4 class="card-title">'+this.movie.getTitle()+' <br><span class="badge badge-pill badge-info">'+this.movie.getYear()+'</span> <span class="badge badge-pill badge-warning">'+this.movie.getDuration()+'</span> </h4> <p class="card-text">'+this.movie.getDesc()+'</p><div> <h5 style="margin-top: 20px;">Watch:</h5> <a href="javascript:void(0)" class="btn btn-info trailer" id="'+this.movie.getIMDB()+'">Trailer</a> '+qualityBtn+' <br><br><h5 style="margin-top: 20px;">Subtitles:</h5> <ul class="list-lang '+this.movie.getIMDB()+'"></ul> </div></div></div></li>')
              }
          })
      }

      /* Methods to control Peerflix */
      private peerflixManager(magnet: string, path: string, mv: Movie) {
          this.noti.playing(mv)

          let cmd: string = 'peerflix "' + magnet + '"'

      	  let peerflix = exec(cmd, {maxBuffer: 1024 * 100000}, (error, stdout, stderror) => {
          	if (error) {
              	console.log('exec error: ' + error)
                  return
              }

              player.createPlayer()
              console.log('stdoud: ' + stdout)
              console.log('stderror: ' + stderror)
          })

          let p = this.peerflix.retrievePIDByName()
          player.createPlayer()
          if (path != '')
            player.serveSubtitle(path)
      }

      /* Stream a torrent using VLC and Peerflix from command line */
      streamTorrent(movieID: string, movieQual: string) {
          console.log(movieQual)

          for (let mv of this.movieList) {
              if (mv.getIMDB() == movieID) {
                  // Get chosen quality
                  let magnet = mv.getMagnetFromQuality(movieQual)
                  // Download Subtitle
                  if (mv.getSubs().length > 0) {
                      let subPath = mv.getSubPath()
                   	  this.peerflixManager(magnet, subPath, mv)
                  } else {
                   	  this.peerflixManager(magnet, '', mv)
                  }
                  console.log('Playing: ' + mv.getTitle())
              }
          }
      }

      /* Kill current Peerflix process and the associated VLC process */
      closePeerflix() {
          let pid = this.peerflix.getPID()
          console.log('Killing Peerflix with PID: ' + pid)
          this.peerflix.killProcess()
      }

      setSubLang(movieID: string, movieLang: string) {
          for (let mv of this.movieList) {
              if (mv.getIMDB() == movieID) {
                  for (let s of mv.getSubs()) {
                      console.log(s.getLang() + ' - ' + movieLang)
                      if (s.getLang() == movieLang) {
                          mv.setSubPath(s.getLink())
                      }
                  }
              }
          }
      }

      openTrailer(movieID: string) {
          for (let mv of this.movieList) {
              if (mv.getIMDB() == movieID) {
                  // Open trailer in browser
                  console.log(mv.getTrailerLink())
                  open(mv.getTrailerLink())
              }
          }
      }


}

export { Controller }
