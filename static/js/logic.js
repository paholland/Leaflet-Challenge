// Store API endpoint inside var
var API_earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(API_earthquakes_url)
var API_plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(API_plates_url)

var plateBoundary = new L.LayerGroup();

// Create the tile layer/the background of the map
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_key
});


var baseLayers = {
    "Street": streetMap,

};

var overlays = {
    "Earthquakes": earthquakes,
    "Plate Boundaries": plateBoundary,
};

var mymap = L.map('map', {
    center: [40, -80],
    zoom: 3,
    // this adds to my map 
    layers: [streetMap]
})

streetMap.addTo(mymap)

function markerSize(magnitude) {
    return magnitude * 5;
};

var earthquakes = new L.LayerGroup();

//  try this way
function Colors(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return 'lightgreen'
    }
};




d3.json(API_earthquakes_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) })
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Colors(geoJsonFeature.properties.mag),
                fillOpacity: 0.6,
                weight: 0.1,
                color: 'grey'

            }
        },

        // display place(title) and time of the event
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h5 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h5> <hr> <h6 style='text-align:center;'>" + feature.properties.title + "</h6>");
        }
    }).addTo(earthquakes);

    earthquakes.addTo(mymap)

    // creates a blue trace line 
    var legend = L.control({ position: 'bottomright' });

    // map mymap .. loop to generate a label with colors
    legend.onAdd = function (mymap) {
        var div = L.DomUtil.create("div", "info legend");
        var magnitude = [0, 1, 2, 3, 4, 5];
        // var colors = []

        // var colors = [
        //     "#98EE00",
        //     "#D4EE00",
        //     "#EECC00",
        //     "#EE9C00",
        //     "#EA822C",
        //     "#EA2C2C"
        //   ];

        
        // function displayLegend(){
        //     var legendInfo = [{
        //         limit: "Magnitude: 0-1",
        //         color: "lightgreen"
        //     },{
        //         limit: "Magnitude: 1-2",
        //         color: "green"
        //     },{
        //         limit:"Magnitude: 2-3",
        //         color:"yellow"
        //     },{
        //         limit:"Magnitude: 3-4",
        //         color:"tan"
        //     },{
        //         limit:"Magnitude: 4-5",
        //         color:"darkorange"
        //     },{
        //         limit:"Magnitude: 5+",
        //         color:"red"
        //     }];

        div.innerHTML += "<h4 style='margin:6px'></h4>"


        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML += '<i style="background: ' + Colors(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);




// geoJasonFeature is declared but value never read yet 

  
    d3.json(API_plates_url, function (geoJson) {
        L.geoJSON(geoJson, {

       
        }).addTo(plateBoundary);

        plateBoundary.addTo(mymap);
    });
})

