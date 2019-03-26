const d3 = require('d3');
module.exports = {
  render(t) { 
    this.id = t.id;
    this.el = d3.select("#" + this.id);
    if (t.data)
      this.onData(t);
  },
  
  onData(t) {
    this.el.selectAll('.quote')
      .remove().exit()
      .data([t.data.txt])
      .enter()
      .append("div")
      .attr('class', 'quote')
      .style('color', '#eedba5')
      .style('padding', '1vmin')
      .style('font-size', '3vmin')
      .html(t.data.txt || "");

    this.el.selectAll('.author')
      .remove().exit()
      .data([t.data.txt])
      .enter()
      .append("div")
      .attr('class', 'author')
      .style('color', '#eedba5')
      .style('padding', '1vmin')
      .style('font-size', '2vmin')
      .style('text-align', 'right')
      .html("~" + t.data.auth + "~");
  }

}
