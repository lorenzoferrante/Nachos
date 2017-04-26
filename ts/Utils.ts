const dns = require('dns')
const fs = require('fs')
const exec = require('child_process').exec
const zlib = require('zlib')

class Utils {

    constructor() {}

    /* Methods */
    /* Check for internet connection */
    checkConnection(): boolean {
        dns.lookup('google.com', (err) => {
            if (err && err.code == 'ENOTFOUND') {
                console.log('[Error] connection failed')
                return false
            } else {
                console.log('[Success] connection established')
                return true
            }
        })
        return false
    }

    /* Generate random string */
    makeid() {
        var text = "", i
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

        for (i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length))

        return text
    }

}

export { Utils }
