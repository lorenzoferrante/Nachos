const exec = require('child_process').exec

class Process {
    private pid: number

    constructor() {}

    // Setters
    setPID(pid: number) {
        this.pid = pid
    }

    // Getters
    getPID(): number {
        return this.pid
    }

    // Methods
    retrievePIDByName(): number {
        let cmd = 'ps -A | grep peerflix | head -c 5'
        exec(cmd, (err, stdout, stderr) => {
            if (err) console.log(err)

            console.log(stderr)
            this.pid = stdout
            return stdout
        })

        return 0
    }

    killProcess(): boolean {
        let cmd = 'kill ' + this.pid
        exec(cmd, (err, stderr, stdout) => {
            if (err) {
                console.log(err)
                return false
            }

            console.log(stdout)
            console.log(stderr)
        })
        return true
    }

}

export { Process }
