const exec = require('child_process').exec

class Process {
    /* If false, process does not exist or it was killed
    if it's true, process is running */
    status: boolean = false
    private pid: number
    private name?: string

    constructor(name?: string) {
        this.name = name
    }

    // Setters
    setPID(pid: number) {
        this.pid = pid
    }

    // Getters
    getPID(): number {
        return this.pid
    }

    getStatus(): boolean {
        return this.status
    }

    // Methods
    retrievePIDByName(): number {
        if (this.name == 'undefined') {
            return 0
        }

        let cmd = 'pgrep -f ' + this.name
        exec(cmd, (err, stdout, stderror) => {
            if (err) {
                console.error(err)
                return
            }

            this.pid = stdout
            this.status = true
            return this.pid
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
            this.status = false
            return true
        })
        return true
    }

}

export { Process }
