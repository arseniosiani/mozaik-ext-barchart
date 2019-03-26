const d3 = require('d3');
const _ = require('lodash');

module.exports = {

  render(t) { 
    this.id = t.id;
    let width = (500 * t.cols) * 1.77;
    let height = (500 * t.rows);

    let style = ".bar{fill: steelblue;} text.values,.text_legend{fill:#eedba5;font-size:30px} .tick{fill:#eedba5;font-size:30px}";
    let el = d3.select("#" + this.id);
    this.svg = el.append('svg')
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", "100%")
      .attr("height", "100%")
    t.stretch ? this.svg.attr("preserveAspectRatio", "none") : this.svg.attr("preserveAspectRatio", "xMidYMid meet");
    this.svg.append('style').html(style)

    if (t.data)
      this.onData(t);

  },
  
  onData(t) {
    let data = t.data;
    let width = (500 * t.cols) * 1.77;
    let height = (500 * t.rows);

    let keys = data.map(d => Object.keys(d)).reduce((a, b) => a.concat(b), []);
    keys = _.uniq(keys);
    keys = _.pull(keys, 'label');
    if (!keys.length)
      return;

    var series = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetDiverging)(data);

    let margin = { t: 20, l: 50, r: 20, b: 50 };

    var x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .rangeRound([margin.l, width - margin.r])
      .padding(0.1);

    var y = d3.scaleLinear()
      .domain([d3.min(series, this.stackMin), d3.max(series, this.stackMax)])
      .rangeRound([height - margin.b, margin.t]);

    var z = d3.scaleOrdinal(this.theme.colors);

    this.svg.append("g")
      .selectAll("g")
      .remove().exit()
      .data(series)
      .enter().append("g")
      .attr("fill", function (d) { return z(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("width", x.bandwidth)
      .attr("x", function (d) { return x(d.data.label); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })

    
    this.svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));

    this.svg.append("g")
      .attr("transform", "translate(" + margin.l + ",0)")
      .call(d3.axisLeft(y));
  },

  stackMin(serie) {
    return d3.min(serie, function (d) { return d[0]; });
  },
  stackMax(serie) {
    return d3.max(serie, function (d) { return d[1]; });
  }
}
