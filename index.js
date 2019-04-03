const serveStatic = require('serve-static')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');
const browserify = require('browserify');
const fs = require('fs');
const moment = require('moment');
const colors = require('colors');

module.exports = {
  all_tiles: [],
  polling:{},
  start: function (config, host, port) { 
    let check_result = this._checkConfig(config);
    if (check_result !== true) { 
      this.log("error", "Error in config: " + check_result.bold);
      process.exit(1);
    }

    fs.writeFileSync(__dirname + '/src/config.json',JSON.stringify(config))
    let b = browserify();
    b.add('./src/main.js');
    b.bundle().pipe(fs.createWriteStream(__dirname + '/dist/main.js'));

    this.all_tiles = config.dashboards.map(d => d.tiles).reduce((a, b) => a.concat(b), [])
    this.all_tiles.forEach(t => {
      if (t.url) {
        let poll_rate = t.poll_rate || 60000;
        this.log('info', "Registering polling for tile "+t.id.blue+" (every "+(poll_rate/1000).toString().blue+" seconds)")
        this.polling[t.id] = setInterval(this.updateTile, poll_rate, t);
        this.updateTile(t, true);
      }
    });

    app.get('/', function (req, res) {
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

    port = port || 5000;
    host = host || "0.0.0.0";
    http.listen(port, host, () => this.log('info', "Rijola is listening on " + host.blue.bold + ":" + port.toString().blue.bold));

    io.on('connection', (socket) => {
      this.log('info', 'new client connected');
      this.all_tiles.forEach(t => {
        if (t.data)
          io.emit('update_tile', t)
      });
      setInterval(() => {
        socket.emit('ping')
      }, 10000);
    });

  },

  updateTile: function(tile, avoid_log) {
    let url = tile.url;
    let self = this;
    if (!avoid_log)
      this.log('info', 'polling ' + tile.url.blue + " for tile " + tile.id.blue);
    request.get({
      url,
      rejectUnauthorized: false,
    }, function (error, response, body) {
        if (error) { 
          self.log("error", error);
          return;
        }
        try {
          let data = JSON.parse(body)
          tile.data = data;
          io.emit('update_tile', tile)
        }
        catch (e) { 
          self.log("error", e.message);
        }
      })
  },

  _checkConfig: function (config) { 
    if (!config.dashboards)
      return 'missing root element "dashboard"';
    if (typeof config.dashboards !== typeof [])
      return 'root element "dashboard" must be array';
    
    this.log('info','Config check is OK!')
    return true;
  },
  log: function (level, txt) { 
    let date = moment().format('YYYY-MM-DD HH:mm:ss').toString().cyan
    level = level.toUpperCase()
    if (level === 'INFO') { 
      level = level.green;
      txt = txt.green
    }
    else if (level === 'WARN') {
      level = level.yellow;
      txt = txt.yellow.underline
    }
    else if (level === 'ERROR') {
      level = level.red;
      txt = txt.red.bold
    }
    
    console.log("["+date+" "+level+"] "+txt)
  }

}