import { Movie } from './Movie'
import { emitter as EM } from './emit'

const yifySub = require('yifysubtitles')
const fs = require('fs')

class MovieSub implements SubInterface {
    private imdbCode: string
    private subs: any

    constructor(mv: Movie) {
        this.imdbCode = mv.getIMDB()
        this.searchSub(mv)
    }

    /* Interface Methods */
    searchSub(mv: Movie) {
        yifySub(this.imdbCode, {path: '/tmp', langs: ['en', 'it'], format: 'srt'})
            .then(res => {
                for (let s of res) {
                    fs.rename(s.path, s.path.replace(/\s/g, ''), (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }

                this.subs = res
                EM.emitSubs(res, mv)
            })
    }

    // Getters
    getSubs(): any {
        return this.subs
    }

}

export { MovieSub }
