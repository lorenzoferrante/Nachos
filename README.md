<img src="https://github.com/lorenzoferrante/Nachos/blob/master/static/nachos_logo_2.png" width=200 />

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/lorenzoferrante/Nachos.git
# Go into the repository
cd Nachos
# Install dependencies
npm install -g typescript
npm install
# Run the app
npm start
```

## Changes
#### 21/03/17 - 15:00
- Aggiunta classe Manager.js per gestire le ricerche dei torrent e il comando peerflix.
- Aggiunta classe TorrentInfo.js che gestisce il file .torrent di ogni Movie (in mancanza del magnet link)
- Aggiornata classe Movie.js con aggiunta dell'attributo torrent, che risulta utile in mancanza del magnet link)
