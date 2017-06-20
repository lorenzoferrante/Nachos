import { Movie } from './Movie'
import { Notification } from './Notification'
import { Controller } from './Controller'

const yify = require('../js/yify')
const $ = require('jQuery')
const humanizeDuration = require('humanize-duration')
const open = require('open')
const fs = require('fs')
const readline = require('readline')
const http = require('http')
const request = require('request')
const path = require('path')
const nn = require('nearest-neighbor')

const currentYear = new Date().getFullYear()
const API = {
  list: 'https://yts.ag/api/v2/list_movies.json',
  listDownload: 'https://yts.ag/api/v2/list_movies.json?sort_by=download_count&limit=50',
  listGenre: 'https://yts.ag/api/v2/list_movies.json?sort_by=download_count&limit=50&genre=',
  detail: 'https://yts.ag/api/v2/movie_details.json'
}

class RelatedController {
    findRelatedMovies() {
        let movies = []

        request({url: API.listDownload, method: 'GET', json: true}, (err, res, body) => {
            const moviesAll = body.data.movies

            moviesAll.forEach(function (movie, i) {
                let mv = {
                    index: i,
                    cover: movie.medium_cover_image,
                    imdb: movie.imdb_code,
                    title: movie.title_english,
                    genres: movie.genres,
                    summary: movie.summary,
                    rating: movie.rating,
                    year: movie.year
                }
                movies.push(mv)
            })

            let fields = [
                { name: 'title', measure: nn.comparisonMethods.word },
                { name: 'genres', measure: nn.comparisonMethods.wordArray },
                { name: 'summary', measure: nn.comparisonMethods.word },
                { name: 'rating', measure: nn.comparisonMethods.number, max: 10 },
                { name: 'year', measure: nn.comparisonMethods.number, max: currentYear },
            ]

            let reader = readline.createInterface({
                input: fs.createReadStream(__dirname + '/../watched-movies.txt'),
                output: fs.createWriteStream('/dev/null'),
                terminal: false
            })

            reader.on('line', function(line) {
                console.log(line)
                for (let mv of movies) {
                    if (line == mv.imdb) {
                        let query = mv
                        let x = movies.indexOf(query)
                        movies.splice(x, 1)

                        console.log(mv.title + ':\n')

                        let id = mv.imdb
                        let id1 = `#${id}`
                        $('#container').append('<h5>Perchè hai visto: ' + mv.title + '</h5')
                        $('#container').append('<ul class="list-genre1" id="'+id+'"></ul>')

                        for (let i = 0; i < 7; i++) {
                            nn.findMostSimilar(query, movies, fields, (nearestNeighbor, probability) => {
                                let prob = Math.round(probability * 100) + '%'
                                console.log('[' + prob + ']\t ' + nearestNeighbor.title)

                                $(id1).append('<li class="rel"><a href="#" id="'+nearestNeighbor.title+'" class="suggMovie"><div class="poster-box"><span class="badge badge-pill badge-success" id="prob">'+prob+'</span><img src="'+nearestNeighbor.cover+'" class="poster1"></div></a></li>')
                                // Rimuovo dall'array il nearestNeighbor appena trovato
                                let y = movies.indexOf(nearestNeighbor)
                                movies.splice(y, 1)
                            })
                        }
                        console.log('\n')
                    }
                }
            })
        })
    }

}

export { RelatedController }
