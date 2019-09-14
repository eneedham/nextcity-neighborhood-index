/* =====================
Leaflet Configuration
===================== */
// A $( document ).ready() block.
$( document ).ready(function() {


//Creating the map
var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});

map.scrollWheelZoom.disable();

//Adding the basemap
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


//Style function to change style based on quantile breaks
var Total_Style = function(feature) {
  if (feature.properties.TotalScore <= -7){
      return {fillColor: "#BB4107", fillOpacity: 0.7, color: "#BB4107", weight: 2};  }
  if (feature.properties.TotalScore <= -3){
      return {fillColor: "#DC7C4E", fillOpacity: 0.7, color: "#DC7C4E", weight: 2};  }
  if (feature.properties.TotalScore <= 2){
      return {fillColor: "#C1B5C6", fillOpacity: 0.7, color: "#9D88A6", weight: 2};  }
  if (feature.properties.TotalScore <= 6){
      return {fillColor: "#6F4D8F", fillOpacity: 0.7, color: "#6F4D8F", weight: 2};  }
  if (feature.properties.TotalScore <= 14){
      return {fillColor: "#1F0439", fillOpacity: 0.7, color: "#1F0439", weight: 2};  }

};

//Changing the opacity and line weight for when a feature is moused over
var overStyle = {
  fillOpacity: 0.3,
  weight: 4,
};

//Changing the opacity and line weight back to original
var outStyle = {
  fillOpacity: 0.7,
  weight: 2
};

//Creating a global variable to store the coordinates of each feature when it gets clicked on, label var, and tooltip var
var view = [];
var label = [];
var tooltip = [];

var bounds = map.getBounds().pad(0.25); // slightly out of screen



//Function that dictates what happens to each feature of the leaflet layer
var eachFeature = function(feature, layer) {

  label = ("<div id='text'>" +
  "<div id='name'>" + layer.feature.properties.Neighborho + "</div>" +
  " is " + "<b>" + "<span id='category'>" + '<style>#category{background-color:' + layer.feature.properties.color + '; padding: 5px;}</style>' + layer.feature.properties.category + "</b>" + "</span>" + "</div>" +
   "<br>" + "<table style='width:100%'>" + "<tr>" + "<td>Crime Index</td>" + "<td>"+layer.feature.properties.CrimeScore + "</td>" + "</tr>" +
   "<tr>" + "<td>Median HH Income Index</td>" + "<td>" + layer.feature.properties.MHIScore + "</td>" + "</tr>" +
   "<tr>" + "<td>Population Index</td>" + "<td>"+layer.feature.properties.PopScore + "</td>" + "</tr>" +
   "<tr>" + "<td>Poverty Index</td>" + "<td>"+layer.feature.properties.PovScore + "</td>"+ "</tr>" +
   "<tr>" + "<td>Home Price Index</td>" + "<td>"+layer.feature.properties.MHSScore + "</td>"+ "</tr>" + "</table>");

  tooltip = L.tooltip({
    noWrap: false,
    sticky: true,
    wrapScreen: true
  })
    .setContent(label)
    .setLatLng(new L.LatLng(bounds.getNorth(), bounds.getCenter().lng));

  layer.bindTooltip(tooltip).addTo(map);

  /* =====================
  The following code will run every time a feature on the map is moused over.
  ===================== */

  //Setting the style to change when a feature is moused over, and setting it back to its original state
  layer.on('mouseover', function() { layer.setStyle(overStyle);});
  layer.on('mouseout', function() { layer.setStyle(outStyle);});

  layer.on('click', function (e) {
    /* =====================
    The following code will run every time a feature on the map is clicked.
    ===================== */

    //pushing the lat long of each clicked feature into the view variable
    view.push(e.latlng.lat, e.latlng.lng);

    //setting the map view to center on clicked feature, zooming in to 14.
    map.setView(view, 12);

    //emptying the view variable so that it can be stored with new lat longs
    view = [];

  });
};

//Creating variable for the data
var dataset = 'https://raw.githubusercontent.com/azavea/nextcity-neighborhood-index/master/phila_neighborhoods_stress_index_v4.geojson';

//calling the data from github
$.getJSON(dataset, function(response) {
  //Creating the leaflet layer and adding it to the map
  //Calling the eachFeature and Total_Style functions
           var neighborhood = new L.geoJson(response, {
               onEachFeature: eachFeature,
               style: Total_Style
           }).addTo(map);
       });


//Function to assign the colors to the legend labels
function getColor(d) {
    return d == "Facing the Greatest Challenges" ? '#BB4107' :
           d == "Falling Behind"                 ? '#DC7C4E' :
           d == "Average"                        ? '#C1B5C6' :
           d == "Advancing"                      ? '#6F4D8F' :
           d == "Making the Greatest Advances"   ? '#1F0439' :
                                                   '#FFEDA0';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

//Creating the div for the legend
    var div = L.DomUtil.create('div', 'info legend title'),
        grades = ["Facing the Greatest Challenges", "Falling Behind", "Average", "Advancing", "Making the Greatest Advances" ];

//Legend label
    div.innerHTML += '<b>Philadelphia Progress Index</b><br>';  // don't forget the break tag

// loop through intervals and generate a label with a colored block for each interval
//This is looking through the grades variable created above and pulling the corresponding color from the getColor function
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + getColor(grades[i]) + '"></i> ' +
           (grades[i] ? grades[i] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

});
