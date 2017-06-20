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

}

export { Utils }
