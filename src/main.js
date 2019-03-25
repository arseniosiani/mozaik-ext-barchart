
const d3 = require('d3');
const config = require('./config');
const themes = require('./themes');
const theme = themes['default'];


require('./tiles/text')
require('./tiles/gauge')
require('./tiles/quote')
require('./tiles/barchart_h')
require('./tiles/barchart_v_stack')
require('./tiles/value')
require('./tiles/value_multi')
require('./tiles/rings')

let socket = require('socket.io-client')();

socket.on('update_tile', function (tile) {
  all_tiles[tile.id].onData(tile)
});


let app = d3.select("#app")

let all_tiles = {};
let num_dashboard = 0;
config.dashboards.forEach(d => {
  let dashboard = app.append("div").attr("class", 'dashboard dashboard_' + (num_dashboard));
  let d_rows = d.rows;
  let d_cols = d.cols;
  d.tiles.forEach(t => {
    let tile_comp = { ...require('./tiles/' + t.type) };
    let tile = dashboard.append('div').attr('class', 'tile')
      .style("top", ((t.y / d_rows) * 100) + "%")
      .style("left", ((t.x / d_cols) * 100) + "%")
      .style("width", ((t.cols / d_cols) * 100) + "%")
      .style("height", ((t.rows / d_rows) * 100) + "%");

    let container = tile.append('div').attr('class', 'tile_container');

    if (t.title)
      container.append('div').attr('class', 'tile_header').html(t.title);

    container.append('div').attr('class', 'tile_body').attr('id', t.id);

    if (!t.data)
      t.data = [];
    tile_comp.theme = theme;
    tile_comp.render(t);

    all_tiles[t.id] = tile_comp;
  });

  if (num_dashboard != "0") { 
    dashboard.style('opacity',0)
  }
  num_dashboard++;
});

var t = d3.transition()
  .duration(1000)
  .ease(d3.easeLinear);
let current_dashboard = 0;
let cicle_dashboards = () => { 
  app.selectAll('.dashboard_' + current_dashboard).transition(t).style('opacity', 0)
  current_dashboard = (current_dashboard+1) % config.dashboards.length;
  app.selectAll('.dashboard_' + current_dashboard).transition(t).style('opacity', 1)
  setTimeout(cicle_dashboards, config.dashboards[current_dashboard].time)
}
cicle_dashboards();

