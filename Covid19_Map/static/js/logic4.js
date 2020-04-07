// // Creating map object
// var myMap = L.map("map", {
//   center: [37.9487779,-119.7284779], //37.9487779,-119.7284779,6z
//   zoom: 6,
//   layers: [streetmap, earthquakes]
// });
//
// var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// });
//
// var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.dark",
//   accessToken: API_KEY
// });
// // Adding tile layer to the map
// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// }).addTo(myMap);


function chooseColor(magnitude){
      var fillColor = ""
      if ( magnitude > 8 ) fillColor = "#993404";
      else if ( magnitude > 6 ) fillColor = "#d95f0e";
      else if ( magnitude > 4 ) fillColor = "#fe9929e";
      else if ( magnitude > 2 ) fillColor = "#fed98e";
      // else if ( magnitude > 0 ) fillColor = "#ffffd4";
      else fillColor = "#ffffd4";  // no data
      return fillColor;
    }

function chooseRadius(confirmed){
      var radius = 0
      if ( confirmed > 10000 ) radius = 14;
      else if ( confirmed > 1000 ) radius = 10;
      else if ( confirmed > 100 ) radius = 8;
      else if ( confirmed > 10 ) radius = 6;
      else if ( confirmed > 0 ) radius = 2;
      // else if ( magnitude > 0 ) fillColor = "#ffffd4";
      else radius = 0;  // no data
      return radius;
    }
// Store API query variables
var url = "COVID19_Cases_US.geojson";

d3.json(url, function(response) {
  var covidData = response.features;
  console.log(covidData);
  createFeatures(response.features)
  });

d3.json("MN_counties.geojson", function(response){
  var countiesData = response.features;
  console.log(countiesData);
  createFeatures(response.features)
  });

function createFeatures(covidData, countiesData) {
  function oneachfeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.Combined_Key +
      "</h3><hr><p>Confirmed cases:" + (feature.properties.Confirmed) +
       "</p><hr><p>" + new Date(feature.properties.Last_Update) + "</p>");
  }
  var covid = L.geoJson(covidData, {
    onEachFeature: oneachfeature,
    pointToLayer: function(feature,latlng){
	  return new L.CircleMarker(latlng, {
      radius: chooseRadius(feature.properties.Confirmed),
      fillOpacity: .7,
      fillColor: "#ce1432",
      weight: 0,
      color: "#999"}); // feature.properties.mag
    }
  })//.addTo(myMap);
  var mapStyle = {
    color: "white",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.5
  };
  var counties = L.geoJson(countiesData, {
    // Passing in our style object
    style: mapStyle
  });



  createMap(covid, counties);
}

function createMap(covid, counties){

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "COVID 19 Cases": covid,
      "MN Counties" : counties
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [darkmap, covid]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // legend.addTo(myMap);

}
