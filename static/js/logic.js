// Creating map object
var myMap = L.map("map", {
  center: [46.000996, -94.789513],
  zoom: 6
});

// https://leafletjs.com/examples/map-panes/
// https://stackoverflow.com/questions/38599280/leaflet-overlay-order-points-lines-and-polygons
myMap.createPane('polygons');
myMap.createPane('points');
// myMap.getPane('points').style.zIndex = 650;

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
}).addTo(myMap);


//// local file
// var geoData = "../data/MN_counties.geojson";

// Grab data with jquery from flask app
// $.getJSON("/geodata", function(data) {
d3.json("/geodata", function(data) {
  var countyData = data.features;
  console.log(countyData);

  var counties;

  // highlights counties when hovered
  function highlightFeature(e) {
   var layer = e.target;

   layer.setStyle({
       weight: 5,
       color: '#666',
       dashArray: '',
       fillOpacity: 0.7
   });

   // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
   //     layer.bringToFront();
   // }
   info.update(layer.feature.properties);
  }

  // returns to original style
  function resetHighlight(e) {
   counties.resetStyle(e.target);
   info.update();
  }
  // zoom to county on click
  function zoomToFeature(e) {
   map.fitBounds(e.target.getBounds());
  }

  // Create a new choropleth layer
  counties = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "Percent Age Ovr 65",
    // Set color scale
    scale: ["ffffcc", "#253494"],
    // Number of breaks in step range
    steps: 5,
    // q for quartile
    mode: "q",
    style: {
      // Border color
      color: "orange",
      weight: 1,
      fillOpacity: 0.7
    },


    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: highlightFeature,
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: resetHighlight //,
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: zoomToFeature
      });
      layer.bindPopup("<h3>% Age Ovr 65: " + feature.properties["Percent Age Ovr 65"] + "</h3>");
    },
    pane: 'polygons'
  })//.addTo(myMap);

  // geojson.moveToBack();
  counties.addTo(myMap);

  var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>MN Vulnerable Populations</h4>' +  (props ?
            '<b>' + props.Name + '</b><br />Total pop: ' +
            props.Population + '<br>Total Over 65: ' +
            props.TotalAgeOvr65 + '<br>% Over 65: ' +
            props["Percent Age Ovr 65"] + '<br>Confirmed COVID 19 Cases: ' +
            props.Confirmed
            : 'Hover over a state');
    };

    info.addTo(myMap);


  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = counties.options.limits;
    var colors = counties.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h5>Percent Population over 65</h5>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});

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

// local file
// var covid_geojson = "../data/COVID19_Cases_US.geojson";

// Grab data with jquery or d3 from flask app
// $.getJSON("/covid_geodata", function(data) {
d3.json("/covid_geodata", function(data) {
  var covidData = data.features;
  // var covidFiltered = covidData.filter(function(d) {
  //   return d.Province_State === "Minnesota" });
  console.log(covidData);
  function oneachfeature(feature, layer) {
    // https://gis.stackexchange.com/questions/166252/geojson-layer-order-in-leaflet-0-7-5/167904#167904
    layer.options.zIndex = 650;
    layer.bindPopup("<h4>" + feature.properties.Combined_Key +
      "</h4><hr><p>Confirmed cases: " + (feature.properties.Confirmed) +
       "</p><hr><p>" + new Date(feature.properties.Last_Update) + "</p>");
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
           layer.bringToFront();
       }
  }
  var covid = L.geoJson(covidData, {
    onEachFeature: oneachfeature,
    pointToLayer: function(feature,latlng){
	  return new L.CircleMarker(latlng, {
      radius: chooseRadius(feature.properties.Confirmed),
      fillOpacity: 1,
      fillColor: "#ce1432",
      weight: 0,
      color: "#999"}); // feature.properties.mag
    },
    pane: 'points'
  })

  covid.addTo(myMap);
});
