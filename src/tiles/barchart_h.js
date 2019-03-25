const d3 = require('d3');
module.exports = {

  render(t) { 
    let data = [
      {label:"ADDADAS", value:2},
      {label:"DASDASDASd", value:11},
      {label:"C", value:29},
      {label:"D", value:45},
      {label:"E", value:21},
    ]
    this.id = t.id;

    let style = ".bar{fill: steelblue;} text.values{fill:#eedba5;font-size:3.5vmin} .tick{fill:#eedba5;font-size:1.8vmin}";
    
    let el = d3.select("#" + this.id);
    let svg = el.append('svg').attr('width', "100%").attr('height', "100%");
    svg.append('style').html(style)

    let width = svg._groups[0][0].clientWidth;
    let height = svg._groups[0][0].clientHeight;


    let margin = { t: 20, l: 50, r: 20, b: 20 };
    let inner_w = width - margin.l - margin.r;
    let inner_h = height - margin.t - margin.b;


    let x_value = d => d.value;
    let y_label = d => d.label;
    const x_scale = d3.scaleLinear()
      .domain([0, d3.max(data, x_value)])
      .range([0, inner_w])

    const y_scale = d3.scaleBand()
      .domain(data.map(y_label))
      .range([0, inner_h])
      .padding(0.1)
    
    const label_scale = d3.scaleBand()
      .domain(data.map(y_label))
      .range([0, inner_h])
      .padding(0.1)


    const graph = svg.append('g')
      .attr('transform', 'translate(' + margin.l + ',' + margin.t+')');

    graph.append('g').call(d3.axisLeft(y_scale)).attr('transform', 'translate(-2 ,0)')
    graph.append('g').call(d3.axisBottom(x_scale).tickFormat(d3.format(".3s"))).attr('transform', 'translate(0,' + inner_h + ')');

    graph.selectAll('.bar').data(data).enter()
      .append('rect')
      .attr('y', d => y_scale(y_label(d)))
      .attr('class', 'bar')
      .attr('width', d => x_scale(x_value(d)))
      .attr('height', y_scale.bandwidth())

    graph.selectAll('.values').data(data).enter()
      .append('text')
      .attr('y', d => label_scale(y_label(d)) + label_scale.bandwidth()*2/3)
      .attr('class', 'values')
      .attr('x', d => x_scale(x_value(d)) - 30)
      .text(d => x_value(d))
    
  },
  
  // onData(data) {
  //   d3.select("#ciccio").append("div").html("Second.");
  // }

}
