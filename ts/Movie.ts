import { Torrent } from './Torrent'
import { MovieSub } from './MovieSub'
import { Utils } from './Utils'
import { Notification } from './Notification'

const $ = require('jQuery')

class Sub {
    private title: string
    private path: string
    private lang: string
    private movieIMDB: string

    constructor(title: string, path: string, lang: string, movieIMDB: string) {
        this.title = title
        this.path = path
        this.lang = lang
        this.movieIMDB = movieIMDB
    }

    // Getters
    getTitle(): string {
        return this.title
    }

    getLang(): string {
        return this.lang
    }

    getLink(): string {
        return this.path
    }

    getIMDB(): string {
        return this.movieIMDB
    }
}

class Movie {
  private title: string
  private bgImage: string
  private coverImage: string
  private desc: string
  private magnet: string
  private imdbCode: string
  private trailerLink: string
  private year: string
  private duration: string
  private torrent: Torrent[]
  private subs: Sub[]
  private found: boolean
  private subPath: string
  private u: Utils = new Utils()
  private noti: Notification = new Notification()

  constructor(title: string, bgImage: string, coverImage: string, desc: string, magnet: string, imdbCode: string, year: string, duration: string, trailerLink: string, torrent: Torrent[]) {
    this.title = title
    this.bgImage = bgImage
    this.coverImage = coverImage
    this.desc = desc
    this.magnet = magnet
    this.imdbCode = imdbCode
    this.year = year
    this.duration = duration
    this.trailerLink = trailerLink
    this.torrent = torrent
    this.subs = []
  }

  // Getters
  getTitle(): string {
      return this.title
  }

  getBgImage(): string {
      return this.bgImage
  }

  getCoverImage(): string {
      return this.coverImage
  }

  getDesc(): string {
      return this.desc
  }

  getMagnet(): string {
      return this.magnet
  }

  getIMDB(): string {
      return this.imdbCode
  }

  getYear(): string {
      return this.year
  }

  getDuration(): string {
      return this.duration
  }

  getTrailerLink(): string {
      return this.trailerLink
  }

  getTorrent(): Torrent[] {
      return this.torrent
  }

  getSubs(): any {
      return this.subs
  }

  getSubPath() {
      return this.subPath
  }

  // Setters
  setSubPath(path: string) {
      this.subPath = path
  }

  setSubs(data: any) {
      //console.log('[EVENT] setting subs for: ' + this.title)
      let movieClass = '.' + this.imdbCode

      if (data.length == 0) {
          $(movieClass).append('<li>No subtitles for this movie yet.</li>')
          return
      }
      for (let sub of data) {
          let s = new Sub(this.title, sub.path.replace(/\s/g, ''), sub.langShort, this.imdbCode)

          if (sub.langShort == 'en') {
              $(movieClass).append('<li><a href="javascript:void(0)" id="'+this.imdbCode+'" class="sub"><span class="flag-icon flag-icon-gb flag-icon-squared" id="en"></span></a></li>')
          } else {
              $(movieClass).append('<li><a href="javascript:void(0)" id="'+this.imdbCode+'" class="sub"><span class="flag-icon flag-icon-it flag-icon-squared" id="it"></span></a></li>')
          }

          this.subs.push(s)
      }
  }

  // Methods
  getMagnetFromQuality(movieQual: string): string {
      for (let tor of this.torrent) {
          console.log(movieQual + ' - ' + tor.getQuality())
          if (movieQual == tor.getQuality()) {
              return tor.getTorrentURL()
          }
      }

      // Get Notification for error
      this.noti.torrentError()
      return undefined
  }

  getFavSub(): string {
      let path: string

      for (let s of this.getSubs()) {
          if (s.getLang() == 'it') {
              return s.getLink()
          } else {
              path = s.getLink()
          }
      }

      return path
  }

}

export { Movie };
