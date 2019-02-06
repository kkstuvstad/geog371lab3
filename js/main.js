//create map
var airmap = L.map('map', {
  center: [39.828352, -98.579478],
  zoom: 4,
  maxZoom: 13,
  minZoom: 3,
  detectRetina: true
});

//load basemap
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(airmap);

//Add colors for airports
var ct_colors = chroma.scale('PuOr').mode('lch').colors(2);

for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + ct_colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

//Load airport location points and creates clickable feature for control towers
var airports = null;

airports = L.geoJson.ajax("assets/airports.geojson",{
  attribution: 'US Airports &copy; Data.gov | US States &copy; Mike Bostock, D3 | Base Map &copy; CartoDB | Map created by Kristoffer Stuvstad',
  //click for popup feature
  onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.CNTL_TWR);
  },
  pointToLayer: function (feature, latlng) {
      var id = 0;
      if (feature.properties.CNTL_TWR == "Y") {id = 0;}
      else {id = 1;} //CNTL_TWR == 'N'
      return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
  }
});

airports.addTo(airmap);

//loads states file
L.geoJson.ajax("assets/us-states.geojson");

//color ramp for states created
colors = chroma.scale('Blues').colors(7);

function setColor(density) {
    var id = 0;
    if (density > 60) { id = 6; }
    else if (density > 50 && density <= 60) { id = 5; }
    else if (density > 40 && density <= 50) { id = 4; }
    else if (density > 30 && density <= 40) { id = 3; }
    else if (density > 20 && density <= 30) { id = 2; }
    else if (density > 10 && density <= 20) { id = 1; }
    else { id = 0; }
    return colors[id];
}

//color palette created for states
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

//adds states and applies colors
L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(airmap);

//Add basic map elements (legend and scale)
//adds legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Airports per State</b><br />';
    div.innerHTML += '<i style="background: ' + colors[6] + '; opacity: 0.5;"></i><p> >60</p>';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5;"></i><p>51 - 60</p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5;"></i><p>41 - 50</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5;"></i><p>31 - 40</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5;"></i><p>21 - 30</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5;"></i><p>11 - 20</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5;"></i><p>0 - 10</p>';
    div.innerHTML += '<hr><b>Control Towers<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p>Airport w/ Control Tower</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p>No Control Tower</p>';
    // Return the Legend div containing the HTML content
    return div;
};

legend.addTo(airmap);

//adds scale
L.control.scale({position: 'bottomleft'}).addTo(airmap);
