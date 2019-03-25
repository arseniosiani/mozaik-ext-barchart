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
      .attr("y", height / 10)
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
      .attr("y", height / 3)
      .attr("x", width / 2)
      .attr("width", width)
      .style("font-size", function () { return Math.min(height / 2, width / this.getComputedTextLength() * 15) + "px" })
      .style("text-align", "center");

    let more_data = [];
    if (t.data['tl-label'])
      more_data.push({ label: t.data['tl-label'], value: t.data['tl-value'], position: 'tl' });
    if (t.data['tr-label'])
      more_data.push({ label: t.data['tr-label'], value: t.data['tr-value'], position: 'tr' });
    if (t.data['bl-label'])
      more_data.push({ label: t.data['bl-label'], value: t.data['bl-value'], position: 'bl' });
    if (t.data['br-label'])
      more_data.push({ label: t.data['br-label'], value: t.data['br-value'], position: 'br' });

    let xpos = (d) => { 
      if (d.position === "tl") return width * .3;
      if (d.position === "bl") return width * .3;
      if (d.position === "tr") return width * .7;
      if (d.position === "br") return width * .7;
    }
    let ypos = (d) => {
      if (d.position === "tl") return height * .7;
      if (d.position === "tr") return height * .7;
      if (d.position === "bl") return height * .85;
      if (d.position === "br") return height * .85;
    }
    this.svg.selectAll('.more_val_label')
      .remove().exit()
      .data(more_data)
      .enter()
      .append('text')
      .attr('class', "more_val_label")
      .style("fill", this.theme.colors[1])      
      .attr('alignment-baseline', 'central')
      .attr("dominant-baseline", 'center')
      .attr('text-anchor', "end")
      .text((d) => d.label+":")
      .attr("y", ypos)
      .attr("x", xpos)
      .style("font-size", function () { return (height * .04 )+ "px" })
      .style("text-align", "right");

    this.svg.selectAll('.more_val_val')
      .remove().exit()
      .data(more_data)
      .enter()
      .append('text')
      .attr('class', "more_val_val")
      .style("fill", this.theme.colors[2])
      .style("font-weigh", "bold")
      .attr('alignment-baseline', 'central')
      .attr("dominant-baseline", 'center')
      .attr('text-anchor', "start")
      .text((d) => " "+d.value)
      .attr("y", ypos)
      .attr("x", xpos)
      .style("font-size", function () { return (height * .05) + "px" })
      .style("text-align", "left");
  }

}
