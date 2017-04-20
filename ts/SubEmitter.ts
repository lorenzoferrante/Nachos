import { Movie } from './Movie'

const EventEmitter = require('events').EventEmitter
EventEmitter.prototype._maxListeners = 100

class SubEmitter {
    emitter: any

    constructor() {
        this.emitter = new EventEmitter()
    }

    emitSubs(subs: any, mv: Movie) {
        this.emitter.emit(mv.getTitle(), subs)
    }

    receiveSubs(mv: Movie) {
        this.emitter.on(mv.getTitle(), (data) => {
            mv.setSubs(data)
        })
    }

}

export { SubEmitter }
