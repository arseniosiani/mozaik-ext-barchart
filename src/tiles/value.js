const d3 = require('d3');
module.exports = {
  render(t) { 
    this.id = t.id;
    let width = (500 * t.cols) * 1.77;
    let height = (500 * t.rows);

    this.svg = d3.select("#" + this.id).append('svg')
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", "100%")
      .attr("height", "100%")
    t.stretch ? this.svg.attr("preserveAspectRatio", "none") : this.svg.attr("preserveAspectRatio", "xMidYMid meet");

    this.svg.append('rect').attr("x", 0)
      .attr("y", height / 4)
      .attr("width", width)
      .attr("height", height / 2)
      .style("fill", this.theme.colors[3]);
  },
  
  onData(t) {
    let width = (500 * t.cols) * 1.77;
    let height = (500 * t.rows);

    this.svg.selectAll('.main_val')
      .remove().exit()
      .data([t.data.value])
      .enter()
      .append('text')
      .attr('class', "main_val")
      .style("fill", this.theme.colors[1])
      .attr('alignment-baseline', 'central')
      .attr('text-anchor', "middle")
      .text((d) => d)
      .attr("y", height / 2)
      .attr("x", width / 2)
      .attr("width", width)
      .style("font-size", function () { return Math.min(height / 2, width / this.getComputedTextLength() * 15) + "px" })
      .style("text-align", "center");

    this.svg.selectAll('.label_val')
      .remove().exit()
      .data([t.data.text])
      .enter()
      .append('text')
      .attr('class', "label_val")
      .style("fill", this.theme.colors[2])
      .attr('alignment-baseline', 'central')
      .attr('text-anchor', "middle")
      .text((d) => d)
      .attr("y", height / 4.5)
      .attr("x", width / 2)
      .attr("width", width)
      .style("font-size", function () { return Math.min(height / 3, width / this.getComputedTextLength() * 15) + "px" })
      .style("text-align", "center");
  }

}
