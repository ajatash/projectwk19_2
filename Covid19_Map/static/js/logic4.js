// choose radius for circles baed on number of cases
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

// Store data query variables
var url = "../data/COVID19_Cases_US.geojson";

// read in geojson
d3.json("../data/MN_counties.geojson", function(response1) {
  d3.json(url, function(response2) {
    var covidData = response2.features;
    console.log(response2);
    var countiesData = response1.features;
    console.log(response1);
    createFeatures(covidData, countiesData)
    });
  });

// funtion to create and draw features
function createFeatures(covidData, countiesData) {
  function oneachfeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.Combined_Key +
      "</h3><hr><p>Confirmed cases:" + (feature.properties.Confirmed) +
       "</p><hr><p>" + new Date(feature.properties.Last_Update) + "</p>");
  }
  var mapStyle = {
    color: "orange",
    fillColor: "",
    fillOpacity: 0,
    weight: 2
  };
  var counties = L.geoJson(countiesData, {
    // Passing in our style object
    style: mapStyle,
    onEachFeature: function( feature, layer ){
      layer.bindPopup( "<h3>Population: " + feature.properties.Population + "</h3>")
    }
  });
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


// call create map
  createMap(covid, counties);
}

// function to take created features and put them into a map
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


}
