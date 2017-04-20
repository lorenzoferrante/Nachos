import { Torrent } from './Torrent'
import { MovieSub } from './MovieSub'

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
  bgImage: string
  coverImage: string
  desc: string
  magnet: string
  imdbCode: string
  year: string
  torrent: Torrent
  subs: Sub[]
  found: boolean

  constructor(title: string, bgImage: string, coverImage: string, desc: string, magnet: string, imdbCode: string, year: string, torrent: Torrent) {
    this.title = title
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

  // Setters
  setSubs(data: any) {
      console.log('[EVENT] setting subs for: ' + this.title)
      for (let sub of data) {
          let s = new Sub(this.title, sub.path, sub.langShort, this.imdbCode)
          this.subs.push(s)
      }
  }

}

export { Movie };
