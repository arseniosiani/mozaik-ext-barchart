const d3 = require('d3');
module.exports = {
  render(t) { 
    this.id = t.id;
    this.el = d3.select("#" + this.id);
    if (t.data)
      this.onData(t);
  },
  
  onData(t) {
    this.el.append("div")
      .style('color', '#eedba5')
      .style('padding', '1.2vmin')
      .style('font-size', '4vmin')
      .html(t.data.quote || "");

    this.el.append("div")
      .style('color', '#eedba5')
      .style('padding', '1.2vmin')
      .style('font-size', '2vmin')
      .style('text-align', 'right')
      .html("~" + t.data.author + "~");
  }

}
