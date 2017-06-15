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
const peerflix = require('peerflix')
const network = require('network-address')
const numeral = require('numeral')
const readTorrent = require('read-torrent')
const fs = require('fs')
const portfinder = require('portfinder')
const http = require('http')

class Controller {
      peerflixProc: Process
      utils: Utils
      noti: Notification
      movie: Movie
      movieList: Movie[]
      torrentList: Torrent[]
      pid: number

      constructor() {
          this.utils = new Utils()
          this.noti = new Notification()
          this.peerflixProc = new Process()
          this.movieList = []
          this.torrentList = []
      }

      // Methods
      /* Search torrent given the title using YIFY API */
      searchTorrent(query: string) {
          yify.search(query, (error, result) => {
              this.movieList = []

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
                  this.torrentList = []
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

                  $('#results').append('<li class="res"><div class="card" style="width: 100%;"> <div class="img-cont"><img class="card-img-top" src="'+this.movie.getBgImage()+'"></div> <div class="card-block"><div class="poster-box"><img src="'+this.movie.getCoverImage()+'" class="poster"></div> <h4 class="card-title">'+this.movie.getTitle()+' <br><span class="badge badge-pill badge-info">'+this.movie.getYear()+'</span> <span class="badge badge-pill badge-warning">'+this.movie.getDuration()+'</span> </h4> <p class="card-text">'+this.movie.getDesc()+'</p><div> <h5 style="margin-top: 20px;">Watch:</h5> <a href="javascript:void(0)" class="btn btn-info trailer" id="'+this.movie.getIMDB()+'">Trailer</a> '+qualityBtn+' <br><br><h5 style="margin-top: 20px;">Subtitles:</h5> <ul class="list-lang '+this.movie.getIMDB()+'"></ul> </div></div></div></li>')

                  //console.log(this.movie)
              }
          })
      }

      /* Methods to convert number in bytes */
      private bytes(num: number) {
          return numeral(num).format('0.0b')
      }

      /* Methods to control Peerflix */
      private peerflixManager(magnet: string, path: string, mv: Movie) {
          readTorrent(magnet, (err, torrent) => {
              console.log(torrent)
              // TODO: Gestire errore
              if (err) return

              let engine = peerflix(torrent)
              let downloadedPercentage = 0
              let verified = 0
              let ready = false

              engine.on('ready', () => {
                  console.log('Ready to download the torrent.')
                  ready = true
              })

              engine.server.on('listening', () => {
                  let addr = 'http://' + network() + ':' + engine.server.address().port
                  console.log(addr)

                  // Write file
                  let dataToWrite
                  if (path != '') {
                      player.serveSubtitle(path)
                      dataToWrite = addr + '\ntrue'
                  } else {
                      dataToWrite = addr + '\nfalse'
                  }

                  fs.writeFile(__dirname + '/../server.txt', dataToWrite, (err) => {
                      if (err) console.log(err)
                      console.log('File server.txt written')
                  })

                  this.noti.playing(mv)
                  player.createPlayer()

                  let p = this.peerflixProc.retrievePIDByName()
              })

              engine.on('verify', () => {
                  verified++
                  downloadedPercentage = Math.floor(verified / engine.torrent.pieces.length * 100)
                  if (ready)
                      console.log('Downloaded: ' + downloadedPercentage + '% at speed: ' + this.bytes(engine.swarm.downloadSpeed()) + '/s')
              })
          })
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
          let pid = this.peerflixProc.getPID()
          console.log('Killing Peerflix with PID: ' + pid)
          this.peerflixProc.killProcess()
      }

      /* Setting sub lang by user preference */
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

      /* Open trailer in the browser */
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
