const browserify = require('browserify');
var serveStatic = require('serve-static')
const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const  http = require('http').Server(app);
let io = require('socket.io')(http);
const config = require('./src/config');


var b = browserify();
b.add('./src/main.js');
b.bundle().pipe(fs.createWriteStream('./dist/main.js'));


io.on('connection', function (socket) {
  all_tiles.forEach(t => {
    if (t.data)
      io.emit('update_tile', t)
  });
  setInterval(() => {
    socket.emit('ping')
  }, 10000);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.post('/push/:tile_id', function (req, res) {
  let tile_id = req.params.tile_id;
  let tile = config.tiles.find(t => t.id === tile_id);
  let data = req.body;
  io.emit('update_tile', { ...tile, data });
  res.send("OK");
});
app.use(serveStatic('./dist'));
app.use(express.json());

http.listen(5000);

let updateTile = (tile) => {
  let url = tile.url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => { 
      tile.data = data;
      io.emit('update_tile', tile)
    })

}

let all_tiles = config.dashboards.map(d => d.tiles).reduce((a,b) => a.concat(b),[])
let polling = {};
all_tiles.forEach(t => {
  if (t.url) {
    let poll_rate = t.poll_rate || 60000;
    polling[t.id] = setInterval(updateTile, poll_rate, t);
    updateTile(t);
  }
});
