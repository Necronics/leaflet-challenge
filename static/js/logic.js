// Pulling data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

// Creating info on popups
function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

// Setting fill color and size of popups
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  
    pointToLayer: function (feature, latlng) {
      if (feature.geometry.coordinates[2] >= 90){
        var eqFillColor =  "#DF0101"
      }
      else if (feature.geometry.coordinates[2] >= 70){
        var eqFillColor =  "#FF8000"
      }
      else if (feature.geometry.coordinates[2] >= 50){
        var eqFillColor =  "#F7BE81"
      }
      else if (feature.geometry.coordinates[2] >= 30){
        var eqFillColor =  "#FFFF00"
      }
      else if (feature.geometry.coordinates[2] >= 10){
        var eqFillColor =  "#C8FE2E"
      }
      else {
        var eqFillColor =  "#00FF00"
      }
      var geojsonMarkerOptions = {
        fillColor: eqFillColor,
        color: "#000",
        radius: feature.properties.mag * 4,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
      return L.circleMarker(latlng, geojsonMarkerOptions, );
  }
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Creating the street and earthquake layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [street, earthquakes]
  })

  // Creating the legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
    div.innerHTML +='<i style="background:#00FF00"></i> -10-10<br>';
    div.innerHTML +='<i style="background:#C8FE2E"></i> 10-30<br>';
    div.innerHTML +='<i style="background:#FFFF00"></i> 30-50<br>';
    div.innerHTML +='<i style="background:#F7BE81"></i> 50-70<br>';
    div.innerHTML +='<i style="background:#FF8000"></i> 70-90<br>';
    div.innerHTML +='<i style="background:#DF0101"></i> 90+<br>';
    return div;
  };
  legend.addTo(myMap);
}
