am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end



// create chart
var chart = am4core.create("avg-temperature-chartdiv", am4charts.GaugeChart);
chart.innerRadius = -15;
chart.background.fill = 'white'
chart.background.opacity = 0.3;
chart.fontSize = 20;
var axis = chart.xAxes.push(new am4charts.ValueAxis());
axis.min = 0;
axis.max = 100;
axis.strictMinMax = true;
var colorSet = new am4core.ColorSet();

var gradient = new am4core.LinearGradient();
gradient.stops.push({color:am4core.color("red")})
gradient.stops.push({color:am4core.color("yellow")})
gradient.stops.push({color:am4core.color("green")})

axis.renderer.line.stroke = gradient;
axis.renderer.line.strokeWidth = 15;
axis.renderer.line.strokeOpacity = 1;
axis.renderer.labels.template.fill = am4core.color("#000");
axis.renderer.labels.template.fontWeight = '900';

axis.renderer.grid.template.disabled = true;

var hand = chart.hands.push(new am4charts.ClockHand());
hand.radius = am4core.percent(97);

setInterval(function() {
    hand.showValue(Math.random() * 100, 1000, am4core.ease.cubicOut);
}, 2000);


}); // end am4core.ready()
