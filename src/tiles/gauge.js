const d3 = require('d3');

module.exports = {
  arc1: null,
  arc2: null,
  chart: null,
  needle_len: null,
  current_value: 0,

  render(t) {
    this.id = t.id;
    var barWidth,  percent, radius,  svg;

    percent = t.value || 0;
    let chartInset = 10;

    let el = d3.select('#' + this.id);
    let margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    let style = ".chart-filled {fill: steelblue;} .chart-empty { fill: #dedede; } .needle, .needle-center{ fill: #000; } ";

    svg = el.append('svg')
      .attr("viewBox", "0 0 500 500")
      .attr("width", "100%")
      .attr("height", "100%")
      //.attr("preserveAspectRatio", "none")

    let width = (500 )// * 1.77;
    let height = (500 );

    radius = Math.min(width, height) - 20;
    barWidth = 40 * Math.min(width, height) / 200;

    this.needle_len = (Math.min(width, height) / 1.5)


    svg.append('style').html(style)
    this.chart = svg.append('g').attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) - 15 ) + ")");
    this.chart.append('path').attr('class', "arc chart-filled");
    this.chart.append('path').attr('class', "arc chart-empty");

    this.arc2 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
    this.arc1 = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)

    this.needle_radius = this.needle_len / 6;
    this.chart.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.needle_radius);
    this.needle = this.chart.append('path').attr('class', 'needle').attr('d', this.recalcPointerPos(percent));

    this.repaintGauge(percent)
  },

  onData(data) {
    this.moveTo(data.value)
  },

  repaintGauge: function (perc) { 
    let padRad = 0.025;
    let totalPercent = .75;
    var next_start = totalPercent;
    let arcStartRad = this.percToRad(next_start);
    let arcEndRad = arcStartRad + this.percToRad(perc / 2);
    next_start += perc / 2;
    
    this.arc1.startAngle(arcStartRad).endAngle(arcEndRad);

    arcStartRad = this.percToRad(next_start);
    arcEndRad = arcStartRad + this.percToRad((1 - perc) / 2);

    this.arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

    this.chart.select(".chart-filled").attr('d', this.arc1);
    this.chart.select(".chart-empty").attr('d', this.arc2);
  },

  moveTo: function (perc) {
    let oldValue = this.current_value;
    this.current_value = perc;

    this.chart.transition().delay(100).ease(d3.easeQuad).duration(200).select('.needle').tween('reset-progress', () => {
      let self = this
      return function (percentOfPercent) {
        var progress = (1 - percentOfPercent) * oldValue;
        self.repaintGauge(progress);
        return d3.select(this).attr('d', self.recalcPointerPos(progress));
      };
    });

    this.chart.transition().delay(300).ease(d3.easeBounce).duration(1500).select('.needle').tween('progress', () => {
      let self = this;
      return function (percentOfPercent) {
        var progress = percentOfPercent * perc;
        self.repaintGauge(progress);
        return d3.select(this).attr('d', self.recalcPointerPos(progress));
      };
    });
  },


  percToDeg: function (perc) {
    return perc * 360;
  },
  percToRad: function (perc) {
    return this.degToRad(this.percToDeg(perc));
  },
  degToRad: function (deg) {
    return deg * Math.PI / 180;
  },
  recalcPointerPos: function (perc) {
    var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
    thetaRad = this.percToRad(perc / 2);
    centerX = 0;
    centerY = 0;
    topX = centerX - this.needle_len * Math.cos(thetaRad);
    topY = centerY - this.needle_len * Math.sin(thetaRad);
    leftX = centerX - this.needle_radius * Math.cos(thetaRad - Math.PI / 2);
    leftY = centerY - this.needle_radius * Math.sin(thetaRad - Math.PI / 2);
    rightX = centerX - this.needle_radius * Math.cos(thetaRad + Math.PI / 2);
    rightY = centerY - this.needle_radius * Math.sin(thetaRad + Math.PI / 2);
    return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
  }


}
