<img src="https://github.com/lorenzoferrante/Nachos/blob/master/static/nachos_logo_2.png" width=200 />

## How To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/lorenzoferrante/Nachos.git
# Go into the repository
cd Nachos
# Install dependencies
# NOTE: sudo is just for macOS
(sudo) npm install -g typescript
(sudo) npm install
# Run the app
npm start
```
## Known Bugs
- Subtitles duplicates for a movie when it is searched again.
- Problem quitting Peerflix directly from the app, letting the possibility to instantiate two or more Peerflix processes concurrently.
