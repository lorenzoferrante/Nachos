import { Torrent } from './Torrent'
import { MovieSub } from './MovieSub'
import { Utils } from './Utils'

const $ = require('jQuery')

class Sub {
    title: string
    path: string
    lang: string
    movieIMDB: string

    constructor(title: string, path: string, lang: string, movieIMDB: string) {
        this.title = title
        this.path = path
        this.lang = lang
        this.movieIMDB = movieIMDB
    }

    // Methods
    isEmpty(): boolean {
        if (this.path == '')
            return true
        return false
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
  title: string
  id: string
  bgImage: string
  coverImage: string
  desc: string
  magnet: string
  imdbCode: string
  year: string
  torrent: Torrent
  subs: Sub[] = []
  found: boolean
  subPath: string
  u: Utils = new Utils()

  constructor(title: string, bgImage: string, coverImage: string, desc: string, magnet: string, imdbCode: string, year: string, torrent: Torrent) {
    this.title = title
    this.id = this.u.makeid()
    this.bgImage = bgImage
    this.coverImage = coverImage
    this.desc = desc
    this.magnet = magnet
    this.imdbCode = imdbCode
    this.year = year
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

  getTorrent(): Torrent {
      return this.torrent
  }

  getSubs(): any {
      return this.subs
  }

  getID(): string {
      return this.id
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
      for (let sub of data) {
          let s = new Sub(this.title, sub.path.replace(/\s/g, ''), sub.langShort, this.imdbCode)

          let movieClass = '.' + this.imdbCode

          if (sub.langShort == 'en') {
              $(movieClass).append('<li><a href="javascript:void(0)" id="'+this.imdbCode+'" class="sub"><span class="flag-icon flag-icon-gb" id="en"></span></a></li>')
          } else {
              $(movieClass).append('<li><a href="javascript:void(0)" id="'+this.imdbCode+'" class="sub"><span class="flag-icon flag-icon-it" id="it"></span></a></li>')
          }

          this.subs.push(s)
      }
  }

  // Methods
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
