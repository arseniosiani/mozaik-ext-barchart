const d3 = require('d3');
module.exports = {

  render(t) {
    this.id = t.id;

    let width = 500;
    let height = 500;
   
    let el = d3.select("#" + this.id);
    this.svg = el.append('svg')
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", "100%")
      .attr("height", "100%");

    t.stretch ? this.svg.attr("preserveAspectRatio", "none") : this.svg.attr("preserveAspectRatio", "xMidYMid meet");
    
  },
  onData(t) { 
    let data = t.data;
    let twoPi = 2 * Math.PI; // Full circle
    let width = 500;
    let height = 500;
    let arc_size = (height / (data.length * 2));
    let gutter = .1

    let rad = 0;

    let theme = this.theme;
    let svg = this.svg;
    let drawArc = function (d) {
      var ratio = d.value * .75;
      var arc = d3.arc()
        .startAngle(0)
        .endAngle(twoPi * ratio)
        .innerRadius(arc_size * (rad) + (arc_size * gutter))
        .outerRadius(arc_size * (rad + 1));

      d3.select(this)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("d", arc)
        .style("fill", theme['colors'][rad]);

      svg.append('text')
        .style("fill", theme['colors'][rad])
        .attr('alignment-baseline', 'central')
        .attr('text-anchor', "end")
        .text(d.label + " (" + (d.value * 100).toFixed(1) + "%)")
        .attr("y", (height / 2) - (arc_size * rad + (arc_size / 2)))
        .attr("x", width / 2 - (width * .005))
        //.attr("width", width/2)
        .style("font-size", function () { return arc_size / 2.5 + "px" })
        .style("text-align", "center");

      rad++;
    }

    this.svg.selectAll("path")
      .data(data).enter()
      .append("path")
      .each(drawArc);
  }
}
