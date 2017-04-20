import { Movie } from './Movie'
import { emitter as EM } from './emit'

const yifySub = require('yifysubtitles')

class MovieSub implements SubInterface {
    private imdbCode: string
    private subs: any

    constructor(mv: Movie) {
        this.imdbCode = mv.getIMDB()
        this.searchSub(mv)
    }

    /* Interface Methods */
    searchSub(mv: Movie) {
        yifySub(this.imdbCode, {path: '/tmp', lang: ['en', 'it'], format: 'srt'})
            .then(res => {
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
