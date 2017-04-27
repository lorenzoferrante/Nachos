import { Movie } from './Movie'
import { Torrent } from './Torrent'
import { Process } from './Process'
import { emitter as EM } from './emit'
import { MovieSub } from './MovieSub'
import { Utils } from './Utils'
import { Notification } from './Notification'

const EventEmitter = require('events').EventEmitter
const pt = require('path')
const yify = require('yify-search')
const exec = require('child_process').exec
const $ = require('jQuery')

class Controller {
      player: Process
      utils: Utils
      noti: Notification
      movie: Movie
      movieList: Movie[]
      newTorrent: Torrent
      pid: number

      constructor() {
          this.utils = new Utils()
          this.noti = new Notification()
          this.player = new Process()
      }

      // Methods
      /* Search torrent given the title using YIFY API */
      searchTorrent(query: string) {
          this.movieList = []

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

              // reuslt is a JSON object
              for (let mv of result) {
                  let tor: any = mv.torrents[0]
                  this.newTorrent = new Torrent(mv.state, tor.hash, tor.quality, tor.size, tor.url)

                  this.movie = new Movie(mv.title, mv.background_image_original, mv.medium_cover_image, mv.summary, mv.magnet, mv.imdb_code, mv.year, this.newTorrent)

                  // Get subtitles
                  let mvSub = new MovieSub(this.movie)
                  EM.receiveSubs(this.movie)
                  //console.log(this.movie.getTitle() + ': ' + this.movie.getSubs)

                  this.movieList.push(this.movie)

                  //$('#results').append('<li class="res"><div class="card" style="width: 100%;"><img class="card-img-top" src="'+this.movie.getBgImage()+'"><div class="card-block"><img src="'+this.movie.getCoverImage()+'" class="poster"><h4 class="card-title">'+this.movie.getTitle()+'<br><span class="badge badge-pill badge-success">Size: '+this.newTorrent.getSize()+'</span><span class="badge badge-pill badge-primary">'+this.newTorrent.getQuality()+'</span><span class="badge badge-pill badge-info">Year: '+this.movie.getYear()+'</span></h4><p class="card-text">'+this.movie.getDesc()+'</p><a href="#'+$(this).attr("id")+'" class="btn btn-primary watch" id="'+this.movie.getIMDB()+'">Watch!</a></p><a href="#'+$(this).attr("id")+'" class="btn btn-primary sub" id="'+this.movie.getIMDB()+'">Subtitles</a></div></div></li>')

                  $('#results').append('<li class="res"><div class="card" style="width: 100%;"><img class="card-img-top" src="'+this.movie.getBgImage()+'"><div class="card-block"><img src="'+this.movie.getCoverImage()+'" class="poster"><h4 class="card-title">'+this.movie.getTitle()+'<br><span class="badge badge-pill badge-success">Size: '+this.newTorrent.getSize()+'</span><span class="badge badge-pill badge-primary">'+this.newTorrent.getQuality()+'</span><span class="badge badge-pill badge-info">Year: '+this.movie.getYear()+'</span></h4><p class="card-text">'+this.movie.getDesc()+'</p><a href="#'+$(this).attr("id")+'" class="btn btn-primary watch" id="'+this.movie.getIMDB()+'">Watch!</a></p><ul class="list-lang '+this.movie.getIMDB()+'"></ul></div></div></li>')
              }
          })
      }

      /* Methods to control Peerflix */
      private peerflixManager(magnet: string, path: string, mv: Movie) {
          let cmd: string

          this.noti.playing(mv)

          if (path != '') {
              cmd = 'peerflix "' + magnet + '" --vlc -- --sub-file=' + path
              console.log(cmd)
          } else {
              cmd = 'peerflix "' + magnet + '" --vlc'
          }

      	  let peerflix = exec(cmd, {maxBuffer: 1024 * 100000}, (error, stdout, stderror) => {
          	if (error) {
              	console.log('exec error: ' + error)
                  return
              }

              this.player.retrievePIDByName()

              console.log('stdoud: ' + stdout)
              console.log('stderror: ' + stderror)

              //let pid = this.player.retrievePIDByName()
              //console.log('Peerflix with PID: ' + pid)
          })

          this.player.retrievePIDByName()

          peerflix.stdout.on('data', (data) => {
          	//console.log(data.toString('utf8'))
          })
      }

      /* Stream a torrent using VLC and Peerflix from command line */
      streamTorrent(movieID: string) {
          for (let mv of this.movieList) {
              if (mv.imdbCode == movieID) {
                  // Download Subtitle
                  if (mv.getSubs().length > 0) {
                      let subPath = mv.getSubPath()
                   	  this.peerflixManager(mv.magnet, subPath, mv)
                  } else {
                   	  this.peerflixManager(mv.magnet, '', mv)
                  }
                  console.log('Playing: ' + mv.title)
              }
          }
      }

      /* Kill current Peerflix process and the associated VLC process */
      closePeerflix() {
          let pid = this.player.getPID()
          console.log('Killing Peerflix with PID: ' + pid)
          this.player.killProcess()
      }

      /* Print subs for a movie */
      printSubs(movieID: string) {
          for (let mv of this.movieList) {
              if (mv.getIMDB() == movieID) {
                  console.log('Showing subs for: ' + mv.title + ' - IMDB: ' + this.movie.getIMDB().substring(2))
                  for (let s of mv.getSubs()) {
                      console.log(s.getTitle() + ' - ' + s.getLang() + ' - ' + s.getIMDB() + ' - ' + s.getLink())
                  }
              }
          }
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

}

export { Controller }
