const d3 = require('d3');

module.exports = {
  render(t) { 
    this.id = t.id;
    this.el = d3.select("#" + this.id)
      .append("ul");
    if (t.data)
      this.onData(t);
  },
  
  onData(t) {

    let theme = this.theme;
    this.el.selectAll('.item')
      .remove().exit()
      .data(t.data, function (d) { return d})
      .enter()
      .append("li")
      .attr('class', 'item')
      .style('border-bottom', '1px solid ' + theme.dashboard_backgoud)
      .call(function (el) { 
        el.append("div")
          .style('float', 'left')
          .style('color', function (d) { return { GREEN: theme.green, YELLOW: theme.yellow, RED: theme.red }[d.status]})
          .html(function (d) { 
            return {
              GREEN: '<i class="material-icons" style="font-size:3.5vmin">check_circle</i>',
              YELLOW: '<i class="material-icons" style="font-size:3.5vmin">remove_circle</i>',
              RED: '<i class="material-icons" style="font-size:3.5vmin">report</i>'
            }[d.status]
            
          });
        
        el.append("div")
          .style('font-size', '3vmin')
          .style('float', 'right')
          .style('color', d3.color(theme.text).brighter(1))
          .text(function (d) { return d.label });
        
        el.append("div")
          .style('font-size', '2.5vmin')
          .text(function (d) { return d.title });
        el.append("div")
          .style('font-size', '1.8vmin')
          .style('color', d3.color(theme.text).darker(1.5))
          .text(function (d) { return d.description });
      })


  }

}
