class Torrent {
    status: string
    hash: string
    quality: string
    size: string
    url: string

    constructor(status: string, hash: string, quality: string, size: string, url: string) {
        this.status = status
        this.hash = hash
        this.quality = quality
        this.size = size
        this.url = url
    }

    // Getters
    getTorrentURL(): string {
        return this.url
    }

    getQuality(): string {
        return this.quality
    }

    getStatus(): string {
        return this.status
    }

    getSize(): string {
        return this.size
    }

}

export { Torrent }
