/ D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

d3.csv('../../data/data.csv', function(err, censusData) {
    if (err) throw err;

    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.noExercise = +data.noExercise;
    //   console.log(data);
    });



 // Create scale functions
 var yLinearScale = d3.scaleLinear().range([height, 0]);

 var xLinearScale = d3.scaleLinear().range([0, width]);

 // Create axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

// Scale the domain
xLinearScale.domain([
  5,
  d3.max(censusData, function(data) {
    return +data.poverty;
  }),
]);
yLinearScale.domain([
  15,
  d3.max(censusData, function(data) {
    return +data.noExercise;
    }),
]);

var toolTip = d3
.tip()
.attr('class', 'tooltip')
.offset([80, -60])
.html(function(data) {
  var state = data.state;
  var stateAbbr = data.abbr;
  var poverty = data.poverty;
  var exercise = data.noExercise;
  return (
    state + '<br> Poverty: ' + poverty + '<br> No Exercise: ' + exercise
  );
});

chart.call(toolTip);

chart
  .selectAll('circle')
  .data(censusData)
  .enter()
  .append('circle')
  .attr('cx', function(data, index) {
    return xLinearScale(data.poverty);
  })
  .attr('cy', function(data, indext){
    return yLinearScale(data.noExercise);
  })
  .attr('r', '15')
  .attr('fill', 'lightblue')
  .on('click', function(data) {
    toolTip.show(data);
  })
// onmouseout event
.on('mouseout', function(data, index) {
    toolTip.hide(data);
  });

chart
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(bottomAxis);

svg.selectAll("labels")
  .data(censusData)
  .enter()
  .append("text")
  .text(function(data) {
    var stateAbbr = data.abbr;
    return (
      stateAbbr
    );
  })
  .attr("x", function(data, index) {
    return xLinearScale(data.poverty)-13;
  })
  .attr("y", function(data, indext){
    return yLinearScale(data.noExercise)+5;
  })
  .attr("fill", "white");
  


chart.append('g').call(leftAxis);

chart
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 0 - margin.left + 40)
  .attr('x', 0 - height /2)
  .attr('dy', '1em')
  .attr('class', 'axisText')
  .text('No Exercise Since Last Month (%)');

// Append x-axis labels
chart 
  .append('text')
  .attr(
    'transform',
    'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
  )
  .attr('class', 'axisText')
  .text('In Poverty (%)');

});