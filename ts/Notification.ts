import { Movie } from './Movie'

const notifier = require('node-notifier')
const path = require('path')

class Notification {

    constructor() {}

    playing(mv: Movie) {
        notifier.notify({
            title: 'Playing: ' + mv.getTitle(),
            message: 'Wait until player will open',
            icon: path.join(__dirname, '../static/noti_logo.png'),
            sound: false,
            wait: false
        }, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            console.log(res)
        })
    }

    netError() {
        notifier.notify({
            title: 'Network Error',
            message: 'Check Internet connection and then try again',
            icon: path.join(__dirname, '../static/no_conn_logo.png'),
            sound: false,
            wait: false
        }, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            console.log(res)
        })
    }

    torrentError() {
        notifier.notify({
            title: 'Torrent not found',
            message: '',
            icon: path.join(__dirname, '../static/no_conn_logo.png'),
            sound: false,
            wait: false
        }, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
        })
    }
}

export { Notification }
