const d3 = require('d3');
module.exports = {
  id:"ciccio",
  title() { 
    return "title";
  },
  icon() {
    return "icon";
  },

  render() { 

  },
  
  onData(data) {
    d3.select("#ciccio").append("div").html("Second.");
  }

}
